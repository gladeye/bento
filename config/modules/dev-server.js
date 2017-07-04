const { config, read } = require("../utils"),
    respMod = require("resp-modifier"),
    webpack = require("webpack"),
    FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin"),
    BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = config(function(instance) {
    const backEnd = read("server"),
        devServer = {
            disableHostCheck: true,
            historyApiFallback: true,
            noInfo: true,
            compress: false,
            hot: true,
            inline: true,
            quiet: true,
            overlay: true,
            port: read("ports.webpack")
        };

    if (backEnd) {
        devServer.proxy = backEnd.proxy;

        devServer.setup = function(app) {
            app.use(
                respMod({
                    rules: [
                        {
                            match: new RegExp(backEnd.proxy["/"].target, "gi"),
                            replace: `//localhost:${read("ports.webpack")}`
                        }
                    ]
                })
            );
        };
    }

    return instance.merge({
        output: {
            pathinfo: true
        },
        devServer,
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new FriendlyErrorsWebpackPlugin(),
            new BrowserSyncPlugin(
                Object.assign({}, read("browsersync"), {
                    port: read("ports.browsersync"),
                    proxy: `http://localhost:${read("ports.webpack")}`
                }),
                {
                    reload: false
                }
            )
        ]
    });
});
