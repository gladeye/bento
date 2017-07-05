const pathIsInside = require("path-is-inside"),
    path = require("path");

module.exports.select = function(key, presets) {
    return function(answers) {
        return presets[answers.kind][key];
    };
};

module.exports.inside = function(name, root) {
    return function(value) {
        const resolved = path.resolve(value);
        const result = pathIsInside(resolved, root);
        return (
            result ||
            `${name} must be inside ${chalk.bold(
                root
            )}, it's currently resolved to ${chalk.bold(resolved)}`
        );
    };
};

module.exports.trailing = function(char) {
    return function(value) {
        if (value.substr(-1) !== char) value += "/";

        return value;
    };
};
