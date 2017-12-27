import * as webpack from "webpack";
import { Compiler } from "webpack";
import WebpackCompilationError from "~/errors/WebpackCompilationError";

/**
 * Simple wraper for `webpack`
 *
 * @export
 * @class WebpackCompiler
 */
export default class WebpackCompiler {
    /**
     * @public
     * @type {webpack.Compiler.Watching | webpack.Compiler}
     * @memberof WebpackCompiler
     */
    public webpack: webpack.Compiler.Watching | webpack.Compiler;

    /**
     * Execute webpack
     *
     * @param {Configuration} config
     * @returns {Promise<Stats>}
     * @memberof WebpackCompiler
     */
    compile(config: webpack.Configuration): Promise<webpack.Stats> {
        return new Promise((resolve, reject) => {
            this.webpack = webpack(config, (err, stats) => {
                if (err) return reject(err);
                if (stats.hasErrors())
                    return reject(new WebpackCompilationError(stats));
                if (stats.hasWarnings()) {
                    console.warn(stats.toJson().warnings);
                }
                resolve(stats);
            });
        });
    }
}
