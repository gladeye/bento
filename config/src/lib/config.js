export const base = {
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
