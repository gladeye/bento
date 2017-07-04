const { config, read, format } = require("../utils"),
    path = require("path"),
    webpack = require("webpack");

const CleanPlugin = require("clean-webpack-plugin");
const CopyGlobsPlugin = require("copy-globs-webpack-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");

module.exports = config(instance => {
    instance.merge({
        plugins: [
            new CleanPlugin([`${path.join(read("paths.output"), "**/*")}`], {
                root: read("root"),
                verbose: false
            }),

            new CopyGlobsPlugin({
                pattern: read("files.copy"),
                output: `[path]${read("filename")}.[ext]`,
                manifest: read("manifest")
            }),

            new WebpackAssetsManifest({
                output: "assets.json",
                space: 4,
                writeToDisk: false,
                sortManifest: true,
                assets: read("manifest"),
                replacer: format
            }),

            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
                }
            })
        ]
    });

    if (read("env.isProduction")) {
        const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

        instance.merge({
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
                    sourceMap: read("enabled.sourceMap")
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

    return instance;
});
