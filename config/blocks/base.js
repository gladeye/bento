module.exports = function(config, options, { select }) {
    config.merge({
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
};
