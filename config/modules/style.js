const { config, read } = require("../utils");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = config(instance => {
    return instance.merge({
        module: {
            rules: [
                {
                    test: /\.css$/,
                    include: /node_modules/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        publicPath: "../",
                        use: [
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: read("enabled.sourceMap")
                                }
                            }
                        ]
                    })
                },

                {
                    test: /\.scss$/,
                    include: read("paths.input"),
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        publicPath: "../",
                        use: [
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: read("enabled.sourceMap")
                                }
                            },

                            {
                                loader: "postcss-loader",
                                options: {
                                    ident: "postcss",
                                    plugins: () => {
                                        const browsers = read(
                                            "browserslist.browsers"
                                        );
                                        return [
                                            require("autoprefixer")({
                                                browsers
                                            })
                                        ];
                                    },
                                    sourceMap: read("enabled.sourceMap")
                                }
                            },
                            {
                                loader: "resolve-url-loader",
                                options: {
                                    sourceMap: read("enabled.sourceMap")
                                }
                            },
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: read("enabled.sourceMap")
                                }
                            }
                        ]
                    })
                }
            ]
        },

        plugins: [
            new ExtractTextPlugin({
                filename: `styles/${read("filename").replace(
                    "hash:",
                    "contenthash:"
                )}.css`,
                disable: !read("env.isProduction")
            })
        ]
    });
});
