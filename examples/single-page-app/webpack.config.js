const { config } = require("@gladeye/bento");

module.exports = config({
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
        input: "./app/",
        output: "./public/",
        public: "/"
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
        hash: ".[hash:8]",
    },

    /**
     * ------------------------------------------------------------------------
     * Additional options
     * ------------------------------------------------------------------------
     * sourceMap: Enable / disable source map
     *
     */
    enabled: {
        sourceMap: true
    },

    /**
     * ------------------------------------------------------------------------
     * Browserslist
     * ------------------------------------------------------------------------
     * "browsers":      Define stack of supported browsers that will use for
     *                  PostCSS `autoprefixer` and `babel-preset-env` [1]
     *
     * [1] @see https://github.com/ai/browserslist#queries
     *
     */
    browserslist: {
        browsers: [
            "last 1 version"
        ]
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
                        browsers: "@{browserslist.browsers}"
                    },
                    loose: true,
                    modules: false,
                    useBuiltIns: true
                }
            ],
            "stage-2"
        ]
    },

    /**
     * ------------------------------------------------------------------------
     * Browsersync
     * ------------------------------------------------------------------------
     * `browsersyncs` options can be defined here, notes that `port` and
     * `proxy` will be ignored
     *
     * @see https://www.browsersync.io/docs/options#option-files
     */
    browsersync: {
        open: true,
        ghostMode: false,
        watchOptions: {
            ignoreInitial: true,
            ignored: "*.txt",
            cwd: "@{paths.input}"
        },
        files: [
            "./index.ejs"
        ]
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
    },

    /**
     * ------------------------------------------------------------------------
     * HTML Plugin options
     * ------------------------------------------------------------------------
     * `html-webpack-plugin` options can be defined here.
     *
     * @see https://github.com/jantimon/html-webpack-plugin#configuration
     *
     */
    html: {
        template: "./index.ejs",
        showErrors: true
    },

    /**
     * ------------------------------------------------------------------------
     * Blocks
     * ------------------------------------------------------------------------
     * Webpack config are constructed by waterfall-ling down to each one of
     * these blocks, thus order matters. Feel free to add you own, list item
     * must be a function which will receive `config, options, utils` as
     * arguments. The `config` argument is an instance of `webpack-config`
     *
     * @see https://fitbit.github.io/webpack-config/
     *
     * "list":      List of blocks that will construct webpack config. Check
     *              existing blocks for usage.
     *              Note: Block item can return a Promise
     *
     * "timeout":   Wait time before throwing a timeout error if async block
     *              hasn't been resolved or rejected.
     *
     */
    blocks: {
        timeout: 3000,
        list: [
            require("@gladeye/bento/config/blocks/ports"),
            require("@gladeye/bento/config/blocks/name"),
            require("@gladeye/bento/config/blocks/manifest"),
            require("@gladeye/bento/config/blocks/base"),
            require("@gladeye/bento/config/blocks/script"),
            require("@gladeye/bento/config/blocks/style"),
            require("@gladeye/bento/config/blocks/media"),
            require("@gladeye/bento/config/blocks/plugins"),
            require("@gladeye/bento/config/blocks/html"),
            require("@gladeye/bento/config/blocks/dev-server")
        ]
    }
});

