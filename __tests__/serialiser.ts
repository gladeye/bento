const pretty = require("pretty-format");

const cwd = (() => {
    let cwd;

    return {
        serialize(val) {
            return JSON.stringify(val.replace(cwd, "<cwd>"));
        },

        test(val) {
            cwd = process.cwd();
            return typeof val === "string" && val.indexOf(cwd) === 0;
        }
    };
})();

module.exports = {
    test() {
        return true;
    },

    serialize(val) {
        return pretty(val, {
            callToJSON: false,
            plugins: [cwd]
        });
    }
};
