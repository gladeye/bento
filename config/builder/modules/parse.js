const objectPath = require("object-path"),
    { parse } = require("@kenvunz/shoelace");

module.exports = function(options) {
    return objectPath(parse(options));
};
