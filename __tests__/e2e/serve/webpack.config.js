require("ts-node").register();
const bento = require("../../../src/index");

module.exports = bento(
    {
        homeDir: "./app",
        outputDir: "./public",
        html: "index.html",
        proxy: {
            "/api": {
                target: "http://[::1]:9000",
                pathRewrite: { "^/api": "" }
            }
        }
    },
    ["~/main.js"],
    process.env.NODE_ENV
);
