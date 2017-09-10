import path from "path";
import webpack from "webpack";
import merge from "webpack-merge";
import CleanPlugin from "clean-webpack-plugin";
import CopyGlobsPlugin from "copy-globs-webpack-plugin";
import WebpackAssetsManifest from "webpack-assets-manifest";

export default function plugins(config, options, { manifest }) {
    return merge(config, {
        plugins: [
            new CleanPlugin(
                [`${path.join(options.get("paths.output"), "**/*")}`],
                {
                    root: options.get("paths.root"),
                    verbose: false
                }
            ),

            new CopyGlobsPlugin({
                pattern: options.get("files.copy"),
                output: `[path]${options.get("filename")}.[ext]`,
                manifest: manifest.data
            }),

            new WebpackAssetsManifest({
                output: "manifest.json",
                space: 4,
                writeToDisk: true,
                sortManifest: true,
                assets: manifest.data,
                replacer: manifest.formatter()
            }),

            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify(options.get("env.value"))
                }
            }),

            new webpack.NamedModulesPlugin()
        ]
    });
}
