const cwd = process.cwd();

module.exports = {
    serialize(val) {
        return JSON.stringify(val.replace(cwd, "<project>"));
    },

    test(val) {
        return typeof val === "string" && val.indexOf(cwd) === 0;
    }
};
