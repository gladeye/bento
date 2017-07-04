const { config, read } = require("../utils");

module.exports = config(instance => {
    return instance.merge({
        module: {
            rules: [
                {
                    test: /\.(ttf|eot|woff2?|png|jpe?g|gif|svg)$/,
                    include: read("paths.input"),
                    loader: "file-loader",
                    options: {
                        name: `[path]${read("filename")}.[ext]`
                    }
                },
                {
                    test: /\.(ttf|eot|woff2?|png|jpe?g|gif|svg)$/,
                    include: /node_modules/,
                    loader: "file-loader",
                    options: {
                        name: `vendor/${read("filename")}.[ext]`
                    }
                }
            ]
        }
    });
});
