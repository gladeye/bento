import webpack from "webpack";
import merge from "webpack-merge";
import CleanPlugin from "clean-webpack-plugin";
import ManifestPlugin from "webpack-manifest-plugin";
import { basename, dirname } from "path";

export default function plugins(config, options) {
    return merge(config, {
        plugins: [
            new CleanPlugin([options.get("paths.output")], {
                root: options.get("paths.root"),
                verbose: false
            }),

            new ManifestPlugin({
                fileName: "manifest.json",
                writeToFileEmit: options.get("enabled.writeManifest"),
                generate(seed, files) {
                    let output = {};

                    files
                        .filter(file => file.isModuleAsset || !file.isAsset)
                        .map(file => {
                            if (file.isModuleAsset) return file;
                            const dir = basename(dirname(file.path));
                            file.name = `${dir}/${file.name}`;
                            return file;
                        })
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
