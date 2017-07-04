const { config, read } = require("../utils");

module.exports = config(instance => {
    return instance.merge({
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: "babel-loader",
                        options: read("babel")
                    }
                }
            ]
        }
    });
});
