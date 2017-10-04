const merge = require("lodash/merge");
const { config } = require("@gladeye/bento");

module.exports = merge(config, {
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

    <%_ if (kind === 'ssa') { _%>
    /**
     * ------------------------------------------------------------------------
     * Back-end Proxy
     * ------------------------------------------------------------------------
     * For Server Side Application, map of endpoints that should be proxied to
     * a back-end server.
     * Note: currently, only "**" is supported.
     *
     */
    proxy: {
        "**": {
            target: <%- JSON.stringify(proxy) %>,
            changeOrigin: true,
            autoRewrite: true
        }
    },

    <%_ } else if (kind === 'spa') { _%>
    /**
     * ------------------------------------------------------------------------
     * Index HTML
     * ------------------------------------------------------------------------
     * Typically for Single Page Application, specify a template to generate
     * the index.html file
     *
     * This will pass straight to `html-webpack-plugin`
     *
     * @see https://github.com/jantimon/html-webpack-plugin#configuration
     *
     */
    html: {
        template: "./index.ejs",
        showErrors: true
    },
    <%_ } _%>

    /**
     * ------------------------------------------------------------------------
     * Blocks
     * ------------------------------------------------------------------------
     * Webpack config are constructed by waterfall-ling down to each one of
     * these blocks, thus order matters. Feel free to add you own, each item
     * must be a function which will receive `config, options, utils` as
     * arguments.
     *
     * "list":      List of blocks that will construct webpack config. Check
     *              existing blocks for usage.
     *              Note: Block item can return a Promise
     *
     * "timeout":   Wait time before throwing a timeout error when async block
     *              hasn't been resolved or rejected.
     *
     */
    blocks: {
        timeout: 3000,
        list: [
            require("@gladeye/bento/config/dst/blocks/ports"),
            require("@gladeye/bento/config/dst/blocks/filename"),
            require("@gladeye/bento/config/dst/blocks/base"),
            require("@gladeye/bento/config/dst/blocks/script"),
            require("@gladeye/bento/config/dst/blocks/style"),
            require("@gladeye/bento/config/dst/blocks/media"),
            require("@gladeye/bento/config/dst/blocks/plugins"),
            require("@gladeye/bento/config/dst/blocks/devServer"),
            require("@gladeye/bento/config/dst/blocks/backEnd")
        ]
    }
});
