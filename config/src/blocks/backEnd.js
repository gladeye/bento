import merge from "webpack-merge";
import respMod from "resp-modifier";

export default function backEnd(config, options) {
    if (options.get("proxy") && options.get("env.isDevServer")) {
        config = merge(config, {
            devServer: {
                proxy: options.get("proxy"),
                setup(app) {
                    app.use(
                        respMod({
                            rules: [
                                {
                                    match: new RegExp(
                                        options.get("proxy")["**"].target,
                                        "gi"
                                    ),
                                    replace: `//localhost:${options.get(
                                        "ports.webpack"
                                    )}`
                                }
                            ]
                        })
                    );
                }
            }
        });
    }

    if (options.get("html")) {
        const HtmlWebpackPlugin = require("html-webpack-plugin");

        config = merge(config, {
            plugins: [new HtmlWebpackPlugin(options.get("html"))]
        });
    }

    return config;
}
