const path = require("path");

module.exports = function(options) {
    ["input", "output"].forEach(key => {
        options.paths[key] = path.resolve(
            path.join(options.paths.root, options.paths[key])
        );
    });

    return options;
};
