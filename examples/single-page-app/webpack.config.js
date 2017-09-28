const { build } = require("@gladeye/bento");
const options = require("./app/config/webpack");

module.exports = build(options);
