import { optimize, DefinePlugin, Loader } from "webpack";
import { extract } from "extract-text-webpack-plugin";
import Bento, { Features as BaseFeatures, Env } from "~/core/Bento";
import { selector } from "~/utils/lang";

export interface Features extends BaseFeatures {
    extractCss: boolean;
}

export default class StandardBento extends Bento {
    /**
     * @protected
     * @type {Features}
     * @memberof StandardBento
     */
    protected features: Features;

    /**
     * @see Bento#configure
     * @protected
     * @memberof StandardBento
     */
    protected configure() {
        // set default addtional features flag
        this.set("extractCss", true);

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
            .addPlugin(
                optimize.CommonsChunkPlugin,
                [
                    {
                        name: "vendor",
                        minChunks(module) {
                            return /node_modules/.test(module.resource);
                        }
                    }
                ],
                Env.Production
            )
            .addPlugin(
                optimize.CommonsChunkPlugin,
                [
                    {
                        name: "manifest"
                    }
                ],
                Env.Production
            )
            .addPlugin(DefinePlugin, (env?: Env): any[] => {
                return [
                    {
                        "process.env": {
                            NODE_ENV: JSON.stringify(env)
                        }
                    }
                ];
            })
            .addPlugin("clean-webpack-plugin", [
                this.config.outputDir,
                {
                    root: this.cwd
                }
            ]);

        // STYLE
        this.addRule("scss", (env?: string): Loader | Loader[] => {
            return extract({
                fallback: {
                    loader: "style-loader",
                    options: {
                        sourceMap: this.features.sourceMap
                    }
                },
                use: [
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: this.features.sourceMap
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
                ]
            });
        })
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
            .addPlugin("extract-text-webpack-plugin", (env?: string): any[] => {
                const select = selector(env);

                return [
                    {
                        filename: select({
                            default: "[name].css",
                            production: "[name].[contenthash:8].css"
                        }),
                        disable: !(
                            this.features.extractCss && env === Env.Production
                        )
                    }
                ];
            });

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
    }
}
