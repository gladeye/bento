import pretty from "pretty-format";
import cwd from "./cwd";
import browsersync from "./browsersync";

module.exports = {
    serialize(val) {
        return pretty(val, {
            callToJSON: false,
            plugins: [cwd, browsersync]
        });
    },

    test() {
        return true;
    }
};
