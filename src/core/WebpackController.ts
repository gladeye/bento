import * as webpack from "webpack";
import { Compiler, Configuration, Stats } from "webpack";
import WebpackCompilationError from "~/errors/WebpackCompilationError";

/**
 * Simple controller for `webpack`
 *
 * @export
 * @class WebpackController
 */
export default class WebpackController {
    /**
     * @public
     * @type {Compiler.Watching | Compiler}
     * @memberof WebpackController
     */
    public compiler: Compiler.Watching | Compiler;

    /**
     * @type {Configuration}
     * @memberof WebpackController
     */
    public config: Configuration;

    /**
     * @type {Stats}
     * @memberof WebpackController
     */
    public stats: Stats;

    /**
     * Creates an instance of WebpackController.
     *
     * @param {Configuration} config
     * @memberof WebpackController
     */
    constructor(config: Configuration) {
        this.config = config;
    }

    /**
     * Execute webpack
     *
     * @returns {Compiler.Watching | Compiler}
     * @memberof WebpackController
     */
    compile(): Promise<Stats> {
        return new Promise((resolve, reject) => {
            this.compiler = webpack(this.config, (err, stats) => {
                if (err) return reject(err);
                if (stats.hasErrors())
                    return reject(new WebpackCompilationError(stats));
                if (stats.hasWarnings()) {
                    console.warn(stats.toJson().warnings);
                }
                resolve((this.stats = stats));
            });
        });
    }
}
