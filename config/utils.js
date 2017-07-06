const { Config, environment } = require("webpack-config"),
    path = require("path"),
    objectPath = require("object-path");

let model;

module.exports.config = function(fn) {
    const config = new Config();
    return fn(config, environment);
};

module.exports.select = function(cases) {
    return cases[model.get("env.value")];
};

module.exports.read = function(key, defaultValue) {
    return model.get(key, defaultValue);
};

module.exports.set = function(opts) {
    let json = JSON.stringify(opts);
    const pre = objectPath(opts),
        matches = json.match(/"@{([\w\.]+)}["\/]/g);

    // replace any "@key" occurrences with the real value
    matches.forEach(match => {
        const key = match.replace(/[@{}\/"]/g, ""),
            value = pre.get(key);

        json = json.replace(
            new RegExp(match, "g"),
            match.substr(-1) === "/" ? `"${value}/` : JSON.stringify(value)
        );
    });

    model = objectPath(JSON.parse(json));
};

module.exports.format = function(key, value) {
    if (typeof value === "string") {
        return value;
    }
    const manifest = value;
    /**
     * Hack to prepend scripts/ or styles/ to manifest keys
     *
     * This might need to be reworked at some point.
     *
     * Before:
     *   {
     *     "main.js": "scripts/main_abcdef.js"
     *     "main.css": "styles/main_abcdef.css"
     *   }
     * After:
     *   {
     *     "scripts/main.js": "scripts/main_abcdef.js"
     *     "styles/main.css": "styles/main_abcdef.css"
     *   }
     */
    Object.keys(manifest).forEach(src => {
        const sourcePath = path.basename(path.dirname(src));
        const targetPath = path.basename(path.dirname(manifest[src]));
        if (sourcePath === targetPath) {
            return;
        }
        manifest[`${targetPath}/${src}`] = manifest[src];
        delete manifest[src];
    });
    return manifest;
};
