import pretty from "pretty-format";

const cwd = process.cwd();

module.exports = {
    serialize(val) {
        const value = pretty(val, {
            callToJSON: false
        });

        return value.replace(new RegExp(cwd, "g"), "<project>");
    },

    test() {
        return true;
    }
};
