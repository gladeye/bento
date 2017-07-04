const { config } = require("@gladeye/webpack-kit");

module.exports = config({
    /**
     * ------------------------------------------------------------------------
     * Paths
     * ------------------------------------------------------------------------
     * "input":     The base directory, an absolute path, for resolving
     *              entry points and loaders from configuration.
     * @see https://webpack.js.org/configuration/entry-context/#context
     *
     * "output":    The output directory as an absolute path.
     * @see https://webpack.js.org/configuration/output/#output-path
     *
     * "public":    The public URL of the output directory when referenced
     *              in a browser.
     * @see https://webpack.js.org/configuration/output/#output-publicpath
     *
     */
    "paths": {
        "root": process.cwd(),
        "input": "<%= input %>",
        "output": "<%= output %>",
        "public": "<%= public %>"
    },

    /**
     * ------------------------------------------------------------------------
     * Entry
     * ------------------------------------------------------------------------
     * "main":      The point or points to enter the application.
     *              Note: vendor static css files can be added here instead of
     *              using standard `import` to improve HMR reload speed.
     * @see https://webpack.js.org/configuration/entry-context/#context
     *
     */
    "entry": {
        "main": [
            // "normalize.css/normalize.css"
            "./scripts/main.js"
        ]
    },

    /**
     * ------------------------------------------------------------------------
     * Caching
     * ------------------------------------------------------------------------
     * "hash":      Hash length that will append to output files for
     *              long term caching.
     * @see https://webpack.js.org/guides/caching/#the-problem
     *
     */
    "caching": {
        "hash": ".[hash:8]",
    },

    /**
     * ------------------------------------------------------------------------
     * Additional options
     * ------------------------------------------------------------------------
     * "sourceMap": Enable / disable source map
     *
     */
    "enabled": {
        "sourceMap": true
    },

    /**
     * ------------------------------------------------------------------------
     * Browserslist
     * ------------------------------------------------------------------------
     * "browsers":      Define stack of supported browsers that will use for
     *                  PostCSS `autoprefixer` and `babel-preset-env`
     * @see https://github.com/ai/browserslist#queries
     *
     */
    "browserslist": {
        "browsers": [
            "last 1 version"
        ]
    },

    /**
     * ------------------------------------------------------------------------
     * Babel
     * ------------------------------------------------------------------------
     * `babel-loader` options can be defined here
     *
     * @see https://github.com/babel/babel-loader
     * @see https://github.com/babel/babel-preset-env
     *
     */
    "babel": {
        presets: [
            [
                "env",
                {
                    targets: {
                        browsers: "@browserslist.browsers"
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
    "browsersync": {
        open: true,
        ghostMode: false,
        watchOptions: {
            ignoreInitial: true,
            ignored: "*.txt",
            cwd: "@paths.root"
        },
        files: [
            // "{app,resources/views}/**/*.php"
        ]
    },

    /**
     * ------------------------------------------------------------------------
     * Files
     * ------------------------------------------------------------------------
     * "copy":      Copy files that match the pattern to the output folder.
     *
     */
    "files": {
        "copy": "+(images|media)/**/*"
    },

    <%if (kind === 'ssa') { %>
    /**
     * ------------------------------------------------------------------------
     * Back-end Server
     * ------------------------------------------------------------------------
     * "proxy":     Map of endpoints that should be proxied to a back-end
     *              server. Note: currently, only a single value "/" is
     *              supported.
     *
     */
    "server": {
        "proxy": {
            "/": {
                target: <%- JSON.stringify(proxy) %>,
                changeOrigin: true,
                autoRewrite: true
            }
        }
    }
    <% } %>

    <%if (kind === 'spa') { %>
    /**
     * ------------------------------------------------------------------------
     * HTML Plugin options
     * ------------------------------------------------------------------------
     * `html-webpack-plugin` options can be defined here.
     *
     * @see https://github.com/jantimon/html-webpack-plugin#configuration
     *
     */
    "html": {
        showErrors: true
    }
    <% } %>

}, process.argv[1].indexOf('webpack-dev-server') >= 0);

