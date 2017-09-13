import ConfigBuilder from "~/lib/ConfigBuilder";

export function build(options) {
    return ConfigBuilder.create(options)
        .build()
        .catch(e => console.error(e));
}

export function bundle(options) {
    const WebpackController = require("~/lib/WebpackController");

    return build(options)
        .then(config => {
            return WebpackController.create(config).bundle();
        })
        .catch(e => console.error(e));
}

export function serve(options, cb) {
    const WebpackController = require("~/lib/WebpackController"),
        BrowserSyncController = require("~/lib/BrowserSyncController"),
        WebpackDevServerController = require("~/lib/WebpackDevServerController");

    return build(options)
        .then(config => {
            WebpackDevServerController.addEntryPoints(config, config.devServer);

            const webpackCtl = WebpackController.create(config);
            webpackCtl.bundle();

            return webpackCtl;
        })
        .then(webpackCtl => {
            return Promise.all([
                BrowserSyncController.create(webpackCtl.config).started,
                WebpackDevServerController.create(
                    webpackCtl.compiler,
                    webpackCtl.config.devServer
                ).started
            ]);
        })
        .then(([browserSyncCtl, devServerCtl]) => {
            // returns a promise which never resolves unless `done` is called
            return new Promise(resolve => {
                if (!cb) return;
                cb(devServerCtl.server, function done() {
                    Promise.all([
                        browserSyncCtl.stop(),
                        devServerCtl.stop()
                    ]).then(resolve);
                });
            });
        })
        .catch(e => console.error(e));
}
