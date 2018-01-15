require("ts-node").register();
const make = require("../../../src/index");

const bento = make({
    homeDir: "./app",
    outputDir: "./public",
    html: "index.html",
    proxy: {
        "/api": {
            target: "http://[::1]:9000",
            pathRewrite: { "^/api": "" }
        }
    }
});

bento.bundle("main", ["~/main.js"]);

module.exports = bento.export(process.env.NODE_ENV);
