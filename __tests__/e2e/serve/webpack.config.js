require("ts-node").register();
const { create } = require("../../../src/index");

const bento = create({
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

bento.findLoader("babel-loader", ({ loader }) => {
    if (loader.options) {
        if (!loader.options.plugins) loader.options.plugins = [];
        loader.options.plugins.push([
            "@babel/plugin-proposal-class-properties",
            { loose: true }
        ]);
    }
});

bento.bundle("main", "~/main.js");

bento.set("emitFiles", /\.json$/);

module.exports = bento.export(process.env.NODE_ENV);
