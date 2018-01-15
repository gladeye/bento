require("ts-node").register();
const make = require("../../../src/index");

module.exports = make(
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
    ["~/main.js"]
);
