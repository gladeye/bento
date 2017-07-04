const { config } = require("../utils");

module.exports = config(instance => {
    return instance.extend(
        "modules/base.js",
        "modules/script.js",
        "modules/style.js",
        "modules/media.js",
        "modules/html.js",
        "modules/plugins.js"
    );
});
