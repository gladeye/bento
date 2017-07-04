const { config } = require("../utils");

module.exports = config(instance => {
    return instance.extend("actions/build.js", "modules/dev-server.js");
});
