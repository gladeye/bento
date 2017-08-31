const objectPath = require("object-path");

module.exports = function(options) {
    let count = 1;

    const fn = function(options) {
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
                    match.substr(-1) === "/"
                        ? `"${value}/`
                        : JSON.stringify(value)
                );
            });
        }
        return JSON.parse(json);
    };

    // go through 2 passes, make sure we are not missing anything
    while (count <= 2) {
        options = fn(options);
        count += 1;
    }

    return objectPath(options);
};
