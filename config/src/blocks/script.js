import merge from "webpack-merge";
import webpack from "webpack";
import { mainScript } from "~/rules";

export default function script(config, options) {
    config = merge(config, {
        module: {
            rules: [mainScript(options)]
        }
    });

    if (options.get("env.isProduction")) {
        config = merge(config, {
            plugins: [
                new webpack.optimize.CommonsChunkPlugin({
                    name: "_vendor",
                    minChunks: function(module) {
                        return /node_modules/.test(module.resource);
                    }
                }),

                new webpack.optimize.CommonsChunkPlugin({
                    name: "_manifest"
                }),

                new webpack.optimize.UglifyJsPlugin({
                    sourceMap: options.get("enabled.sourceMap")
                })
            ]
        });
    }

    return config;
}
