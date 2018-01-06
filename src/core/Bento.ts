import { resolve } from "path";
import {
    Loader,
    Condition,
    Configuration,
    Resolve,
    Entry,
    Plugin
} from "webpack";
import { instantiate, selector } from "../utils/lang";
import { sync as resolveModuleSync } from "resolve";

export interface BaseConfig {
    homeDir: string;
    outputDir: string;
    publicPath?: string;
}

export interface RuleMap {
    [ext: string]: Loader | Loader[];
}

export interface RuleDescriptor {
    ext: string[];
    include: Condition | Condition[];
    loaders: Loader | Loader[] | ((env?: string) => Loader | Loader[]);
}

export interface PluginMap {
    [name: string]: any[];
}

export interface PluginDescriptor {
    plugin: string | Constructor<Plugin>;
    args: any[] | ((env?: string) => any[]);
}

export interface PluginCollection {
    [env: string]: PluginDescriptor[];
}

export interface Features {
    sourceMap: boolean;
}

export enum Env {
    Production = "production"
}

interface Constructor<M> {
    new (...args: any[]): M;
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
    protected config: BaseConfig;

    /**
     * @private
     * @type {string}
     * @memberof Bento
     */
    protected cwd: string;

    /**
     * @private
     * @type {RuleDescriptor[]}
     * @memberof Bento
     */
    protected rules: RuleDescriptor[] = [];

    /**
     * @private
     * @type {PluginCollection}
     * @memberof Bento
     */
    protected plugins: PluginCollection = {};

    /**
     * @private
     * @type {Entry}
     * @memberof Bento
     */
    protected entry: Entry = {};

    /**
     * @private
     * @type {Features}
     * @memberof Bento
     */
    protected features: Features = {
        sourceMap: true
    };

    /**
     * @private
     * @memberof Bento
     */
    protected resolve: (path: string) => string;

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

        this.configure();
    }

    /**
     * Factory method to create an instance of Bento
     *
     * @static
     * @param {BaseConfig} config
     * @param {string} [cwd]
     * @returns {T}
     * @memberof T
     */
    static create<T extends Bento>(
        this: Constructor<T>,
        config: BaseConfig,
        cwd?: string
    ): T {
        return new this(config, cwd);
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
     * @param {Condition | Condition[]} include Specify path inclusion
     * @returns {this}
     * @memberof Bento
     */
    addRule(
        ext: string | string[],
        loaders: Loader | Loader[] | ((env?: string) => Loader | Loader[]),
        include?: Condition | Condition[]
    ): this {
        if (typeof ext === "string") ext = [ext];
        this.rules.push({
            ext,
            include: include || [this.homeDir],
            loaders
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
     * Add to plugin list a new PluginDescriptor by given data
     *
     * @param {string | Constructor<Plugin>} plugin Plugin constructor
     * @param {any[]} args Plugin constructor arguments
     * @param {string} env Env this plugin should be loaded to
     * @returns {this}
     * @memberof Bento
     */
    addPlugin(
        plugin: string | Constructor<Plugin>,
        args: any[] | ((env?: string) => any[]) = [],
        env?: string
    ): this {
        let key = env || "all";

        if (!this.plugins[key]) this.plugins[key] = [];

        this.plugins[key].push({
            plugin,
            args
        });

        return this;
    }

    /**
     * Convenient method to add multiple plugins
     *
     * @param {PluginMap} map
     * @param {string} env Env this plugin should be loaded to
     * @returns {this}
     * @memberof Bento
     */
    addPlugins(map: PluginMap = {}, env?: string): this {
        for (let p in map) {
            this.addPlugin(p, map[p], env);
        }

        return this;
    }

    /**
     * Export data to a standard consumable webpack config file
     *
     * @param {string} [env]
     * @returns {Promise<Configuration>}
     * @memberof Bento
     */
    export(env?: string): Promise<Configuration> {
        const select = selector(env);

        const plugins = [].concat(
            this.plugins.all || [],
            this.plugins[env] || []
        );

        const config = {
            name: "bento",
            entry: this.entry,
            output: {
                path: this.outputDir,
                pathinfo: select({
                    default: true,
                    production: false
                }),
                filename: select({
                    default: "[name].js",
                    production: "[name].[chunkhash:8].js"
                }),
                publicPath: this.publicPath
            },
            devtool: select({
                default: this.features.sourceMap
                    ? "cheap-module-eval-source-map"
                    : null,
                production: this.features.sourceMap ? "source-map" : false
            }),
            resolve: {
                alias: {
                    "~": this.homeDir
                }
            },
            module: {
                rules: this.rules.map(desc => {
                    return {
                        test: new RegExp(`\\.(${desc.ext.join("|")})$`),
                        include: desc.include,
                        use:
                            typeof desc.loaders === "function"
                                ? desc.loaders(env)
                                : desc.loaders
                    };
                })
            },
            plugins: plugins.map(desc => {
                let Plugin;
                if (typeof desc.plugin === "function") Plugin = desc.plugin;
                else {
                    const module = resolveModuleSync(desc.plugin, {
                        basedir: this.cwd
                    });

                    Plugin = require(module);
                }

                return instantiate(
                    Plugin,
                    typeof desc.args === "function" ? desc.args(env) : desc.args
                );
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

    /**
     * Resolved homeDir
     *
     * @readonly
     * @type {string}
     * @memberof Bento
     */
    get homeDir(): string {
        return this.resolve(this.config.homeDir);
    }

    /**
     * Resolved outputDir
     *
     * @readonly
     * @type {string}
     * @memberof Bento
     */
    get outputDir(): string {
        return this.resolve(this.config.outputDir);
    }

    /**
     * Default publicPath
     *
     * @readonly
     * @type {string}
     * @memberof Bento
     */
    get publicPath(): string {
        return this.config.publicPath || "/";
    }

    /**
     * Placeholder method for subclass to configure rules & plugins
     *
     * @protected
     * @memberof Bento
     */
    protected configure(): void {}
}
