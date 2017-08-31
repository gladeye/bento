const { join, resolve } = require("path");

module.exports = function(options) {
    ["input", "output"].forEach(key => {
        if (options.paths[key].indexOf(options.paths.root) === 0) return;

        options.paths[key] = resolve(
            join(options.paths.root, options.paths[key])
        );
    });

    return options;
};
