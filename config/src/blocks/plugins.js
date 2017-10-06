import webpack from "webpack";
import merge from "webpack-merge";
import CleanPlugin from "clean-webpack-plugin";
import CopyWebpackPlugin from "@kenvunz/copy-webpack-plugin";
import ManifestPlugin from "webpack-manifest-plugin";
import { basename, dirname } from "path";

export default function plugins(config, options) {
    const seed = {};

    return merge(config, {
        plugins: [
            new CleanPlugin([options.get("paths.output")], {
                root: options.get("paths.root"),
                verbose: false
            }),

            new CopyWebpackPlugin(
                [
                    {
                        from: options.get("files.copy"),
                        to: `[path]${options.get("filename")}.[ext]`
                    }
                ],
                {
                    manifest: seed
                }
            ),

            new ManifestPlugin({
                seed,
                fileName: "manifest.json",
                writeToFileEmit: options.get("enabled.writeManifest"),
                generate(seed, files) {
                    const addons = [];
                    for (let p in seed)
                        addons.push({
                            path: `${options.get("paths.public")}${seed[p]}`,
                            name: p
                        });

                    let output = {};

                    files
                        .filter(file => file.isModuleAsset || !file.isAsset)
                        .map(file => {
                            if (file.isModuleAsset) return file;
                            const dir = basename(dirname(file.path));
                            file.name = `${dir}/${file.name}`;
                            return file;
                        })
                        .concat(addons)
                        .sort(function(next, prev) {
                            return next.name.localeCompare(prev.name);
                        })
                        .forEach(file => {
                            output[file.name] = file.path;
                        });

                    return output;
                }
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
