module.exports = {
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
    }
};
