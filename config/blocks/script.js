module.exports = function(config, options) {
    config.merge({
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: "babel-loader",
                        options: options.get("babel")
                    }
                }
            ]
        }
    });
};
