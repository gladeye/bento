import merge from "webpack-merge";

export default function(config, options, { select }) {
    return merge(config, {
        context: options.get("paths.input"),
        entry: options.get("entry"),

        devtool: select({
            development: "cheap-module-eval-source-map",
            production: options.get("enabled.sourceMap")
                ? "source-map"
                : undefined
        }),

        output: {
            path: options.get("paths.output"),
            publicPath: options.get("paths.public"),
            filename: `scripts/${options
                .get("filename")
                .replace("hash", "chunkhash")}.js`
        },

        resolve: options.get("resolve")
    });
}
