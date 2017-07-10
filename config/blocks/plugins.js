const path = require("path"),
    webpack = require("webpack");

const CleanPlugin = require("clean-webpack-plugin");
const CopyGlobsPlugin = require("copy-globs-webpack-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");

module.exports = function(config, options, { format }) {
    config.merge({
        plugins: [
            new CleanPlugin(
                [`${path.join(options.get("paths.output"), "**/*")}`],
                {
                    root: options.get("paths.root"),
                    verbose: false
                }
            ),

            new CopyGlobsPlugin({
                pattern: options.get("files.copy"),
                output: `[path]${options.get("filename")}.[ext]`,
                manifest: options.get("manifest")
            }),

            new WebpackAssetsManifest({
                output: "assets.json",
                space: 4,
                writeToDisk: false,
                sortManifest: true,
                assets: options.get("manifest"),
                replacer: format
            }),

            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
                }
            }),

            new webpack.NamedModulesPlugin()
        ]
    });

    if (options.get("env.isProduction")) {
        const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

        config.merge({
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
                }),

                new OptimizeCssAssetsPlugin({
                    cssProcessor: require("cssnano"),
                    cssProcessorOptions: {
                        discardComments: { removeAll: true }
                    },
                    canPrint: true
                })
            ]
        });
    }
};
