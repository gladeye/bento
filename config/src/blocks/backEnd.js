import merge from "webpack-merge";

export default function(config, options) {
    if (options.get("proxy")) {
        config = merge(config, {
            devServer: {
                setup(app) {
                    app.use(
                        respMod({
                            rules: [
                                {
                                    match: new RegExp(
                                        options.get("proxy")["/"].target,
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
