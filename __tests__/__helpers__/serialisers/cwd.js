module.exports = (() => {
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
