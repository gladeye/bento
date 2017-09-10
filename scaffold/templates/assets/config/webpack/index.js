const merge = require("webpack-merge");
const base = require("base.js");
const transpiler = require("transpiler.js");
const devServer = require("devServer.js");
const backEnd = require("backEnd.js");
const blocks = require("blocks.js");

module.exports = merge([
    base,
    transpiler,
    devServer,
    backEnd,
    blocks
]);
