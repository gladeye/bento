module.exports = {
    <%_ if (kind === 'ssa') { _%>
    /**
     * ------------------------------------------------------------------------
     * Back-end proxy
     * ------------------------------------------------------------------------
     * For Server Side Application, map of endpoints that should be proxied to
     * a back-end server.
     * Note: currently, only "/" is supported.
     *
     */
    proxy: {
        "/": {
            target: <%- JSON.stringify(proxy) %>,
            changeOrigin: true,
            autoRewrite: true
        }
    }

    <%_ } else if (kind === 'spa') { _%>
    /**
     * ------------------------------------------------------------------------
     * Back-end HTML
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
    }
    <%_ } _%>
};
