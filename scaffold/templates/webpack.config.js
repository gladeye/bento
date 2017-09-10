const { build } = require("@gladeye/bento");
const config = require("<%= input %>config/webpack");

module.exports = build(config);
