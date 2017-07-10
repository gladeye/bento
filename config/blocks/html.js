const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function(config, options) {
    config.merge({
        plugins: [new HtmlWebpackPlugin(options.get("html"))]
    });
};
