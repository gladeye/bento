import {
    optimize,
    DefinePlugin,
    Loader,
    Configuration,
    NamedModulesPlugin,
    NamedChunksPlugin,
    HotModuleReplacementPlugin
} from "webpack";
import { extract } from "extract-text-webpack-plugin";
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
    writeManifest: boolean;
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
        this.set("extractCss", true).set("writeManifest", true);

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
            .addPlugin("webpack-manifest-plugin", (env?: string): any[] => {
                return [
                    {
                        writeToFileEmit: this.features.writeManifest
                    }
                ];
            })
            .addPlugin(NamedChunksPlugin, [
                chunk => {
                    if (chunk.name) {
                        return chunk.name;
                    }

                    return chunk.mapModules(m => {
                        return basename(m.request, extname(m.request));
                    });
                }
            ])
            .addPlugin(NamedModulesPlugin, [])
            .addPlugin(DefinePlugin, (env?: string): any[] => {
                return [
                    {
                        "process.env": {
                            NODE_ENV: JSON.stringify(env)
                        }
                    }
                ];
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
                        name: "runtime"
                    }
                ],
                Env.Production
            )
            .addPlugin("uglifyjs-webpack-plugin", [], Env.Production);

        // STYLE
        this.addRule("scss", (env?: string): Loader[] => {
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
    protected configure(config: Configuration): Configuration {
        if (this.command !== Command.Serve) return config;
        config.devServer = {
            disableHostCheck: true,
            historyApiFallback: true,
            noInfo: true,
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
