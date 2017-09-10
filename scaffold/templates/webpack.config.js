const { build } = require("@gladeye/bento");
const options = require("<%= input %>config/webpack");

module.exports = build(options);
