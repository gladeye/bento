import {
    DefinePlugin,
    Loader,
    Configuration,
    NamedModulesPlugin,
    NamedChunksPlugin
} from "webpack";
// import * as ExtractTextWebpackPlugin from "extract-text-webpack-plugin";
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as UglifyJsPlugin from "uglifyjs-webpack-plugin";
import * as OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import { basename, extname } from "path";
import { isObject, isString } from "lodash";
import Bento, {
    Config as BaseConfig,
    Features as BaseFeatures,
    Command,
    Env
} from "../core/Bento";
import { selector } from "../utils/lang";

export interface Config extends BaseConfig {
    html?: string | {};
    proxy?: string | {};
}

export interface Features extends BaseFeatures {
    extractCss: boolean;
    emitFiles: boolean | RegExp;
}

export default class StandardBento extends Bento {
    /**
     * @protected
     * @type {Config}
     * @memberof StandardBento
     */
    protected config: Config;

    /**
     * @protected
     * @type {Features}
     * @memberof StandardBento
     */
    protected features: Features;

    /**
     * @see Bento#load
     * @protected
     * @memberof StandardBento
     */
    protected load() {
        // set default addtional features flag
        this.set("extractCss", true).set("emitFiles", false);

        // SCRIPT
        this.addRule(["js", "jsx"], {
            loader: "babel-loader",
            options: {
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            useBuiltIns: "usage"
                        }
                    ]
                ]
            }
        })
            .addPlugin("clean-webpack-plugin", [
                this.config.outputDir,
                {
                    root: this.cwd,
                    verbose: false
                }
            ])
            .addPlugin("webpack-manifest-plugin", [
                {
                    filter(descriptor) {
                        const pathExt = extname(descriptor.path),
                            nameExt = extname(descriptor.name);

                        return pathExt === nameExt;
                    }
                }
            ])
            .addPlugin(
                "write-file-webpack-plugin",
                (env?: string): void | any[] => {
                    let args = null;
                    if (this.features.emitFiles === true) args = [];
                    if (this.features.emitFiles instanceof RegExp)
                        args = [
                            {
                                test: this.features.emitFiles
                            }
                        ];

                    return args;
                }
            )
            .addPlugin(NamedChunksPlugin, [
                (chunk) => {
                    if (chunk.name) {
                        return chunk.name;
                    }

                    return Array.from(chunk.modulesIterable)
                        .map((m: any) => {
                            return basename(m.request, extname(m.request));
                        })
                        .join("_");
                }
            ])
            .addPlugin(NamedModulesPlugin, [])
            .addPlugin(
                DefinePlugin,
                (env?: string): any[] => {
                    return [
                        {
                            "process.env": {
                                NODE_ENV: JSON.stringify(env)
                            }
                        }
                    ];
                }
            );
        // .addPlugin(
        //     optimize.CommonsChunkPlugin,
        //     [
        //         {
        //             name: "vendor",
        //             minChunks(module) {
        //                 return /node_modules/.test(module.resource);
        //             }
        //         }
        //     ],
        //     Env.Production
        // )
        // .addPlugin(
        //     optimize.CommonsChunkPlugin,
        //     [
        //         {
        //             name: "runtime"
        //         }
        //     ],
        //     Env.Production
        // )
        // .addPlugin(
        //     "uglifyjs-webpack-plugin",
        //     (env?: string): any[] => {
        //         return [
        //             {
        //                 sourceMap: this.features.sourceMap
        //             }
        //         ];
        //     },
        //     Env.Production
        // );

        // STYLE
        this.addRule(
            "scss",
            (env?: string): Loader[] => {
                const loaders = [
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: this.features.sourceMap,
                            minimize:
                                env === Env.Production
                                    ? { preset: "default" }
                                    : false
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins() {
                                const autoprefixer = require("autoprefixer");
                                return [autoprefixer()];
                            },
                            sourceMap: this.features.sourceMap
                        }
                    },
                    {
                        loader: "resolve-url-loader",
                        options: {
                            sourceMap: this.features.sourceMap
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: this.features.sourceMap
                        }
                    }
                ];

                if (env === Env.Production && this.features.extractCss) {
                    loaders.unshift({
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "./",
                            sourceMap: this.features.sourceMap
                        }
                    });
                } else {
                    loaders.unshift({
                        loader: "style-loader",
                        options: {
                            sourceMap: this.features.sourceMap
                        }
                    });
                }

                return loaders;
            }
        )
            .addRule(
                "css",
                [
                    {
                        loader: "style-loader",
                        options: {
                            sourceMap: this.features.sourceMap
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: this.features.sourceMap
                        }
                    }
                ],
                /node_modules/
            )
            .addPlugin(
                MiniCssExtractPlugin,
                (env?: string): any[] => {
                    const select = selector(env);

                    return [
                        {
                            filename: select({
                                default: "[name].css",
                                production: "[name].[contenthash:8].css"
                            })
                        }
                    ];
                }
            );

        // FONTS & MEDIA
        this.addRule(
            [
                "ttf",
                "eot",
                "woff",
                "woff2",
                "jpeg",
                "jpg",
                "png",
                "gif",
                "svg",
                "mp4",
                "webm"
            ],
            (env?: string): Loader => {
                const select = selector(env);

                return {
                    loader: "file-loader",
                    options: {
                        name: select({
                            default: "[name].[ext]",
                            production: "[name].[hash:8].[ext]"
                        })
                    }
                };
            },
            [this.homeDir, /node_modules/]
        );

        // HTML
        if (this.html) {
            this.addPlugin("html-webpack-plugin", [this.html]);
        }
    }

    /**
     * @see Bento#configure
     * @protected
     * @memberof StandardBento
     */
    protected configure(
        config: Configuration,
        env: string | void
    ): Configuration {
        if (env === Env.Production) {
            if (!config.optimization) config.optimization = {};

            config.optimization.splitChunks = {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        chunks: "all"
                    }
                }
            };

            config.optimization.runtimeChunk = {
                name: "runtime"
            };

            config.optimization.minimizer = [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: this.features.sourceMap
                }),
                new OptimizeCSSAssetsPlugin({})
            ];
        }

        if (this.command !== Command.Serve) return config;

        config.devServer = {
            disableHostCheck: true,
            historyApiFallback: true,
            overlay: true
        };

        if (this.proxy) config.devServer.proxy = this.proxy;

        return config;
    }

    /**
     * @readonly
     * @protected
     * @type {({} | void)}
     * @memberof StandardBento
     */
    protected get html(): {} | void {
        let output = null;
        if (isString(this.config.html)) {
            output = {
                filename: this.config.html
            };
        } else if (isObject(this.config.html)) {
            output = this.config.html;
        }

        return output;
    }

    /**
     * @readonly
     * @protected
     * @type {({} | void)}
     * @memberof StandardBento
     */
    protected get proxy(): {} | void {
        let output = null;
        if (isString(this.config.proxy)) {
            output = {
                "**": this.config.proxy
            };
        } else if (isObject(this.config.proxy)) {
            output = this.config.proxy;
        }

        return output;
    }
}
