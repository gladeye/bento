export default function bundle(config) {
    const WebpackController = require("~/lib/WebpackController");
    return WebpackController.create(config).bundle();
}
