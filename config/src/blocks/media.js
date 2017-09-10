import merge from "webpack-merge";

export default function media(config, options) {
    return merge(config, {
        module: {
            rules: [
                {
                    test: /\.(ttf|eot|woff2?|png|jpe?g|gif|svg)$/,
                    include: options.get("paths.input"),
                    loader: "file-loader",
                    options: {
                        name: `[path]${options.get("filename")}.[ext]`
                    }
                },
                {
                    test: /\.(ttf|eot|woff2?|png|jpe?g|gif|svg)$/,
                    include: /node_modules/,
                    loader: "file-loader",
                    options: {
                        name: `vendor/${options.get("filename")}.[ext]`
                    }
                }
            ]
        }
    });
}
