import merge from "webpack-merge";
import webpack from "webpack";
import BrowserSyncPlugin from "browser-sync-webpack-plugin";

export default function devServer(config, options) {
    if (!options.get("env.isDevServer")) return config;

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
            new BrowserSyncPlugin(
                Object.assign({}, options.get("browserSync"), {
                    port: options.get("ports.browserSyncMain"),
                    ui: {
                        port: options.get("ports.browserSyncUI")
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
