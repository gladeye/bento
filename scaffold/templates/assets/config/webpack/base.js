module.exports = {
    /**
     * ------------------------------------------------------------------------
     * Environment
     * ------------------------------------------------------------------------
     * "value":     The environment value that should be used to determine
     *              various aspects of webpack config, eg `devtool` value
     *
     */
    env: {
        value: process.env.NODE_ENV || "development",
        isProduction: process.env.NODE_ENV === "production",
        isDevServer: process.argv[1].indexOf("webpack-dev-server") >= 0
    },

    /**
     * ------------------------------------------------------------------------
     * Paths
     * ------------------------------------------------------------------------
     * "root":      The base directory, an absolute path, that will be used
     *              to resolved all other relative paths in here.
     *
     * "input":     The base directory for webpack to looking for resolving
     *              entry points and loaders from configuration. It's relative
     *              to `paths.root` [1]
     *
     * "output":    The output directory. It's relative to `paths.root` [2]
     *
     * "public":    The public URL of the output directory when referenced
     *              in a browser. [3]
     *
     * [1] @see https://webpack.js.org/configuration/entry-context/#context
     * [2] @see https://webpack.js.org/configuration/output/#output-path
     * [3] @see https://webpack.js.org/configuration/output/#output-publicpath
     *
     */
    paths: {
        root: process.cwd(),
        input: "<%= input %>",
        output: "<%= output %>",
        public: "<%= public %>"
    },

    /**
     * ------------------------------------------------------------------------
     * Entry
     * ------------------------------------------------------------------------
     * "main":      The point or points to enter the application.
     *              Note: vendor static css files can be added here instead of
     *              using standard `import` to improve HMR reload speed. [1]
     *
     * [1] @see https://webpack.js.org/configuration/entry-context/#context
     *
     */
    entry: {
        main: [
            // "normalize.css/normalize.css"
            "./scripts/main.js"
        ]
    },

    /**
     * ------------------------------------------------------------------------
     * Resolve
     * ------------------------------------------------------------------------
     * Webpack's `resolve` options can be defined here. [1]
     *
     * By default "~" is resolved to `scripts` folder, make it easier to
     * import modules within there. [2]
     *
     * [1] @see https://webpack.js.org/configuration/resolve/
     * [2] @see https://webpack.js.org/configuration/resolve/#resolve-alias
     *
     */
    resolve: {
        alias: {
            "@": "@{paths.input}",
            "~": "@{paths.input}/scripts"
        }
    },

    /**
     * ------------------------------------------------------------------------
     * Caching
     * ------------------------------------------------------------------------
     * "hash":      Hash length that will append to output files for
     *              long term caching. [1]
     *
     * [1] @see https://webpack.js.org/guides/caching/#the-problem
     *
     */
    caching: {
        hash: ".[hash:8]"
    },

    /**
     * ------------------------------------------------------------------------
     * Additional options
     * ------------------------------------------------------------------------
     * sourceMap: Enable / disable source map
     *
     */
    enabled: {
        sourceMap: "@{env.isDevServer}",
        extractCSS: "@{env.isProduction}",
        writeManifest: true
    },

    /**
     * ------------------------------------------------------------------------
     * Files
     * ------------------------------------------------------------------------
     * "copy":      Copy files that match the pattern to the output folder.
     *              Note: glob path is relative to `paths.input`
     *
     */
    files: {
        copy: "+(images|media)/**/*"
    }
};
