import { resolve } from "path";
import { Loader, Condition, Configuration, Resolve } from "webpack";
import { selector } from "~/utils/env";
import { instantiate } from "~/utils/lang";
import * as resolveModule from "resolve";

export interface BaseConfig {
    homeDir: string;
    outputDir: string;
    entry: {};
    publicPath?: string;
}

export interface RuleMap {
    [ext: string]: Loader | Loader[];
}

export interface Rule {
    include: Condition[];
    use: Loader | Loader[];
}

export interface RuleDescriptor {
    ext: string[];
    rule: Rule;
}

export interface PluginMap {
    [name: string]: any[];
}

export interface PluginDescriptor {
    name: string;
    args: any[];
}

export interface Features {
    sourceMap: boolean;
}

/**
 * Main class of the library
 *
 * @export
 * @class Bento
 */
export default class Bento {
    /**
     * @private
     * @type {BaseConfig}
     * @memberof Bento
     */
    private config: BaseConfig;

    /**
     * @private
     * @type {string}
     * @memberof Bento
     */
    private cwd: string;

    /**
     * @private
     * @type {string}
     * @memberof Bento
     */
    private context: string;

    /**
     * @private
     * @type {RuleDescriptor[]}
     * @memberof Bento
     */
    private rules: RuleDescriptor[] = [];

    /**
     * @private
     * @type {PluginDescriptor[]}
     * @memberof Bento
     */
    private plugins: PluginDescriptor[] = [];

    /**
     * @private
     * @type {Features}
     * @memberof Bento
     */
    private features: Features = {
        sourceMap: true
    };

    /**
     * @private
     * @memberof Bento
     */
    private resolve: (path: string) => string;

    /**
     * @private
     * @memberof Bento
     */
    private select: (choice: {}) => any;

    /**
     * Convenient method to create an instance of Bento
     *
     * @static
     * @param {BaseConfig} config
     * @param {string} [env]
     * @param {string} [cwd]
     * @returns {Bento}
     * @memberof Bento
     */
    public static create(
        config: BaseConfig,
        env?: string,
        context?: string
    ): Bento {
        return new Bento(config, env, context);
    }

    /**
     * Creates an instance of Bento.
     * @param {BaseConfig} config
     * @param {string} [env]
     * @param {string} [cwd]
     * @memberof Bento
     */
    public constructor(
        config: BaseConfig,
        env: string = process.env.NODE_ENV,
        cwd: string = process.cwd()
    ) {
        this.config = config;
        this.cwd = cwd;
        this.context = this.cwd;
        this.resolve = resolve.bind(this, this.context);
        this.select = selector(env);
    }

    /**
     * Create a new RuleDescriptor by a given data and add it to rule list
     *
     * @param {string} ext  File extension
     * @param {Loader | Loader[]} loaders Loaders to use
     * @returns {this}
     * @memberof Bento
     */
    addRule(ext: string | string[], loaders: Loader | Loader[]): this {
        if (typeof ext === "string") ext = [ext];
        this.rules.push({
            ext,
            rule: {
                include: [this.resolve(this.config.homeDir)],
                use: loaders
            }
        });

        return this;
    }

    /**
     * Convenient method to add multiple rules
     *
     * @param {RuleMap} map Map of file extensions and their creators
     * @returns {this}
     * @memberof Bento
     */
    addRules(map: RuleMap = {}): this {
        for (let p in map) {
            this.addRule(p.replace(/\s+/g, "").split(","), map[p]);
        }

        return this;
    }

    /**
     * Create a new PluginDescriptor by given data and add it to plugin list
     *
     * @param {string} name Plugin module name to resolve
     * @param {any[]} args Plugin constructor arguments
     * @returns {this}
     * @memberof Bento
     */
    addPlugin(name: string, args: any[] = []): this {
        this.plugins.push({
            name,
            args
        });

        return this;
    }

    /**
     * Convenient method to add multiple plugins
     *
     * @param {PluginMap} map
     * @returns {this}
     * @memberof Bento
     */
    addPlugins(map: PluginMap = {}): this {
        for (let p in map) {
            this.addPlugin(p, map[p]);
        }

        return this;
    }

    /**
     * Export information to a standard consumable webpack config file
     *
     * @param {(manifest: {}) => void} [override]
     * @returns {Promise<Configuration>}
     * @memberof Bento
     */
    export(override?: (manifest: {}) => void): Promise<Configuration> {
        const description = {
            rules: this.rules,
            plugins: this.plugins
        };

        if (override) override(description);

        const config = {
            name: "bento",
            context: this.context,
            entry: this.config.entry,
            output: {
                path: this.resolve(this.config.outputDir),
                pathinfo: this.select({
                    default: true,
                    production: false
                }),
                filename: this.select({
                    default: "[name].js",
                    production: "[name].[chunkhash].js"
                }),
                publicPath: this.config.publicPath || "/"
            },
            devtool: this.select({
                default: this.features.sourceMap
                    ? "cheap-module-eval-source-map"
                    : null,
                production: this.features.sourceMap ? "source-map" : false
            }),
            resolve: {
                alias: {
                    "~": this.resolve(this.config.homeDir)
                }
            },
            module: {
                rules: this.rules.map(desc => {
                    return Object.assign({}, desc.rule, {
                        test: new RegExp(`\\.(${desc.ext.join("|")})$`)
                    });
                })
            },
            plugins: this.plugins.map(desc => {
                const module = resolveModule.sync(desc.name, {
                    basedir: this.context
                });

                const Plugin = require(module);
                return instantiate(Plugin, desc.args);
            })
        };

        return Promise.resolve(config);
    }

    /**
     * Enable / disable available features
     *
     * @param {string} flag
     * @param {boolean} value
     * @returns {this}
     * @memberof Bento
     */
    set(flag: string, value: boolean): this {
        this.features[flag] = value;
        return this;
    }
}
