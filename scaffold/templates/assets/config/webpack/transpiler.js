module.exports = {
    /**
     * ------------------------------------------------------------------------
     * SCSS
     * ------------------------------------------------------------------------
     * "browsers":      Define stack of supported browsers that will use for
     *                  PostCSS `autoprefixer` [1]
     *
     * [1] @see https://github.com/ai/browserslist#queries
     *
     */
    scss: {
        browsers: ["last 1 version"]
    },

    /**
     * ------------------------------------------------------------------------
     * Babel
     * ------------------------------------------------------------------------
     * `babel-loader` options can be defined here. [1]
     *
     * By default, `babel-loader` is configured with 2 presets,
     * `babel-preset-env` and `babel-preset-stage-2` [2]
     *
     * [1] @see https://github.com/babel/babel-loader
     * [2] @see https://github.com/babel/babel-preset-env
     *
     */
    babel: {
        presets: [
            [
                "env",
                {
                    targets: {
                        browsers: "@{autoprefixer.browsers}"
                    },
                    useBuiltIns: true
                }
            ],
            "stage-2"
        ]
    }
};
