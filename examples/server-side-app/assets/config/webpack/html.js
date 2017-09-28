module.exports = {
    /**
     * ------------------------------------------------------------------------
     * Back-end Proxy
     * ------------------------------------------------------------------------
     * For Server Side Application, map of endpoints that should be proxied to
     * a back-end server.
     * Note: currently, only "/" is supported.
     *
     */
    proxy: {
        "/": {
            target: "http://localhost:8080",
            changeOrigin: true,
            autoRewrite: true
        }
    }

};
