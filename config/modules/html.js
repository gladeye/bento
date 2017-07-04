const { config, read } = require("../utils"),
    HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = config(instance => {
    if (read("server")) return instance;

    return instance.merge({
        plugins: [new HtmlWebpackPlugin(read("html"))]
    });
});
