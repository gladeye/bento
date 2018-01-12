const bento = require("../../../dst/index");

module.exports = bento(
    {
        homeDir: "./app",
        outputDir: "./public"
    },
    ["~/main.js"],
    process.env.NODE_ENV
);
