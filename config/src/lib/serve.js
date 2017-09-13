export default function serve(config, cb = null) {
    const WebpackController = require("~/lib/WebpackController"),
        BrowserSyncController = require("~/lib/BrowserSyncController"),
        WebpackDevServerController = require("~/lib/WebpackDevServerController");

    WebpackDevServerController.addEntryPoints(config, config.devServer);

    const webpackCtl = WebpackController.create(config);
    webpackCtl.bundle();

    return Promise.all([
        BrowserSyncController.create(webpackCtl.config).started,
        WebpackDevServerController.create(
            webpackCtl.compiler,
            webpackCtl.config.devServer
        ).started
    ]).then(([browserSyncCtl, devServerCtl]) => {
        // returns a promise which never resolves unless `done` is called
        return new Promise(resolve => {
            if (!cb) return;
            cb(devServerCtl.server, function done() {
                Promise.all([browserSyncCtl.stop(), devServerCtl.stop()]).then(
                    resolve
                );
            });
        });
    });
}
