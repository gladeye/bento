import merge from "webpack-merge";
import webpack from "webpack";
import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin";
import BrowserSyncPlugin from "browser-sync-webpack-plugin";

export default function(config, options) {
    return merge(config, {
        output: {
            pathinfo: true
        },
        devServer: {
            disableHostCheck: true,
            historyApiFallback: true,
            noInfo: true,
            compress: false,
            hot: true,
            inline: true,
            quiet: true,
            overlay: true,
            port: options.get("ports.webpack")
        },
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
}
