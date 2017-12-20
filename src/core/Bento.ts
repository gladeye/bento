import { resolve } from "path";
import { Loader, Condition } from "webpack";

export interface BaseConfig {
    homeDir: string;
    outputDir: string;
    entry: {};
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
     * @memberof Bento
     */
    private resolve: (path: string) => string;

    /**
     * Convenient method to create an instance of Bento
     *
     * @static
     * @param {BaseConfig} config
     * @returns {Bento}
     * @memberof Bento
     */
    public static create(config: BaseConfig, context?: string): Bento {
        return new Bento(config, context);
    }

    /**
     * Creates an instance of Bento.
     *
     * @param {BaseConfig} config
     * @memberof Bento
     */
    public constructor(config: BaseConfig, context: string = process.cwd()) {
        this.config = config;
        this.resolve = resolve.bind(this, context);
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

    export(middleware?: (manifest: {}) => void): void {
        const description = {
            rules: this.rules,
            plugins: this.plugins
        };

        if (middleware) middleware(description);
    }
}
