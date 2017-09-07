const respMod = require("resp-modifier"),
    webpack = require("webpack"),
    FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin"),
    BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = function(config, options) {
    if (!options.get("env.isDevServer")) return;

    const backEnd = options.get("server"),
        devServer = {
            disableHostCheck: true,
            historyApiFallback: true,
            noInfo: true,
            compress: false,
            hot: true,
            inline: true,
            quiet: true,
            overlay: true,
            port: options.get("ports.webpack")
        };

    if (backEnd) {
        devServer.proxy = backEnd.proxy;

        devServer.setup = function(app) {
            app.use(
                respMod({
                    rules: [
                        {
                            match: new RegExp(backEnd.proxy["/"].target, "gi"),
                            replace: `//localhost:${options.get(
                                "ports.webpack"
                            )}`
                        }
                    ]
                })
            );
        };
    }

    config.merge({
        output: {
            pathinfo: true
        },
        devServer,
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new FriendlyErrorsWebpackPlugin(),
            new BrowserSyncPlugin(
                Object.assign({}, options.get("browsersync"), {
                    port: options.get("ports.browsersync"),
                    ui: {
                        port: options.get("ports.ui")
                    },
                    proxy: `http://localhost:${options.get("ports.webpack")}`
                }),
                {
                    reload: false
                }
            )
        ]
    });
};
