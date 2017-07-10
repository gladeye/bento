const objectPath = require("object-path");

module.exports = function(options) {
    let json = JSON.stringify(options);
    const pre = objectPath(options),
        matches = json.match(/"@{([\w\.]+)}["\/]/g);
    if (matches) {
        // replace any "@key" occurrences with the real value
        matches.forEach(match => {
            const key = match.replace(/[@{}\/"]/g, ""),
                value = pre.get(key);
            json = json.replace(
                new RegExp(match, "g"),
                match.substr(-1) === "/" ? `"${value}/` : JSON.stringify(value)
            );
        });
    }
    return objectPath(JSON.parse(json));
};
