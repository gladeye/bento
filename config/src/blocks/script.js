import merge from "webpack-merge";
import webpack from "webpack";

export default function script(config, options) {
    config = merge(config, {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: "babel-loader",
                        options: options.get("babel")
                    }
                }
            ]
        }
    });

    if (options.get("env.isProduction")) {
        config = merge(config, {
            plugins: [
                new webpack.optimize.CommonsChunkPlugin({
                    name: "_manifest"
                }),

                new webpack.optimize.CommonsChunkPlugin({
                    name: "_vendor",
                    minChunks: function(module) {
                        return /node_modules/.test(module.resource);
                    }
                }),

                new webpack.optimize.UglifyJsPlugin({
                    sourceMap: options.get("enabled.sourceMap")
                })
            ]
        });
    }

    return config;
}
