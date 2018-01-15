const bento = require("../../../dst/index");

module.exports = bento(
    {
        homeDir: "./app",
        outputDir: "./public",
        html: "index.html",
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                pathRewrite: { "^/api": "" }
            }
        }
    },
    ["~/main.js"],
    process.env.NODE_ENV
);
