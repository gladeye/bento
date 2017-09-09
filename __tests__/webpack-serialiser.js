import pretty from "pretty-format";

module.exports = {
    print(val, serialise, indent) {
        const value = pretty(val);

        return value.replace(new RegExp(process.cwd(), "g"), "<project>");
    },

    test(val) {
        return (
            val &&
            val.hasOwnProperty("module") &&
            val.module.hasOwnProperty("rules")
        );
    }
};
