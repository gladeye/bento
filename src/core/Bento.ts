import { resolve } from "path";
import { Loader, Condition, Configuration, Resolve, Entry } from "webpack";
import { instantiate, selector } from "~/utils/lang";
import * as resolveModule from "resolve";

export interface BaseConfig {
    homeDir: string;
    outputDir: string;
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

export enum Env {
    Development = "development",
    Production = "production"
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
     * @type {Entry}
     * @memberof Bento
     */
    private entry: Entry = {};

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
     * Convenient method to create an instance of Bento
     *
     * @static
     * @param {BaseConfig} config
     * @param {string} [cwd]
     * @returns {Bento}
     * @memberof Bento
     */
    public static create(config: BaseConfig, cwd?: string): Bento {
        return new Bento(config, cwd);
    }

    /**
     * Creates an instance of Bento.
     * @param {BaseConfig} config
     * @param {string} [cwd]
     * @memberof Bento
     */
    constructor(config: BaseConfig, cwd: string = process.cwd()) {
        this.config = config;
        this.cwd = cwd;
        this.resolve = resolve.bind(this, this.cwd);
    }

    /**
     * Define `entry` value for webpack config
     *
     * @param {string} name
     * @param {...string[]} files
     * @returns {this}
     * @memberof Bento
     */
    bundle(name: string, ...files: string[]): this {
        this.entry[name] = files.map(file =>
            file.replace("~/", `${this.config.homeDir}/`)
        );
        return this;
    }

    /**
     * Allow all configuration to be modified before webpack configuration
     * is built
     *
     * @param {(manifest: {}) => void} [fn]
     * @returns {this}
     * @memberof Bento
     */
    tinker(fn?: (manifest: {}) => void): this {
        const manifest = {
            rules: this.rules,
            plugins: this.plugins,
            entry: this.entry
        };

        fn(manifest);

        return this;
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
     * Export data to a standard consumable webpack config file
     *
     * @param {Env} [env]
     * @returns {Promise<Configuration>}
     * @memberof Bento
     */
    export(env?: Env): Promise<Configuration> {
        const select = selector(env);

        const config = {
            name: "bento",
            entry: this.entry,
            output: {
                path: this.resolve(this.config.outputDir),
                pathinfo: select({
                    default: true,
                    production: false
                }),
                filename: select({
                    default: "[name].js",
                    production: "[name].[chunkhash].js"
                }),
                publicPath: this.config.publicPath || "/"
            },
            devtool: select({
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
                    basedir: this.cwd
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
