import merge from "webpack-merge";

export default function(config, options) {
    return merge({
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
}
