const BrowserSync = require("browser-sync/lib/browser-sync");

module.exports = {
    serialize(val) {
        return JSON.stringify("BrowserSync {}");
    },

    test(val) {
        return val instanceof BrowserSync;
    }
};
