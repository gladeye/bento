import pretty from "pretty-format";
import project from "./project";
import browsersync from "./browsersync";

module.exports = {
    serialize(val) {
        return pretty(val, {
            callToJSON: false,
            plugins: [project, browsersync]
        });
    },

    test() {
        return true;
    }
};
