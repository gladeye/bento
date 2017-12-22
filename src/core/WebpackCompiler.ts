import WebpackError from "webpack-promise/js/WebpackError";
import * as webpack from "webpack";
import { Compiler } from "webpack";

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
                if (err || stats.hasErrors() || stats.hasWarnings())
                    reject(new WebpackError(err, stats));
                else resolve(stats);
            });
        });
    }
}
