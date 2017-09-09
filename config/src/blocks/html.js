import merge from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default function(config, options) {
    return merge(config, {
        plugins: [new HtmlWebpackPlugin(options.get("html"))]
    });
}
