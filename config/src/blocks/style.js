import merge from "webpack-merge";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import { vendorStyle, mainStyle } from "~/rules";

export default function style(config, options) {
    config = merge(config, {
        module: {
            rules: [mainStyle(options), vendorStyle(options)]
        },

        plugins: [
            new ExtractTextPlugin({
                filename: `styles/${options
                    .get("filename")
                    .replace("hash:", "contenthash:")}.css`,
                disable: !options.get("enabled.extractCSS")
            })
        ]
    });

    if (options.get("env.isProduction")) {
        const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

        config = merge(config, {
            plugins: [
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

    return config;
}
