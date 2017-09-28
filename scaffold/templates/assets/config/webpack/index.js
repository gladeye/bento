const merge = require("webpack-merge");
const base = require("./base.js");
const html = require("./html.js");
const blocks = require("./blocks.js");

module.exports = merge([base, html, blocks]);
