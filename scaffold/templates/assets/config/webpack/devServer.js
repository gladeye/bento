module.exports = {
    /**
     * ------------------------------------------------------------------------
     * BrowserSync
     * ------------------------------------------------------------------------
     * `browserSync` options can be defined here, notes that `port` and
     * `proxy` will be ignored
     *
     * @see https://www.browsersync.io/docs/options#option-files
     */
    browserSync: {
        open: true,
        ghostMode: false,
        watchOptions: {
            ignoreInitial: true,
            ignored: "*.txt",
            <%_ if (kind === 'ssa') { _%>
            cwd: "@{paths.root}"
            <%_ } else if (kind === 'spa') { _%>
            cwd: "@{paths.input}"
            <%_ } _%>
        },
        files: [
            <%_ if (kind === 'ssa') { _%>
            // "{app,resources/views}/**/*.php"
            <%_ } else if (kind === 'spa') { _%>
            "./index.ejs"
            <%_ } _%>
        ]
    }
};
