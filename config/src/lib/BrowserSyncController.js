export default class BrowserSyncController {
    static create(config) {
        return new BrowserSyncController(config);
    }

    constructor(config) {
        config.plugins.forEach(plugin => {
            if (!plugin.browserSync) return;
            this._browserSync = plugin.browserSync;

            this._started = new Promise(resolve => {
                plugin.options.callback = () => {
                    resolve(this);
                };
            });
        });
    }

    get started() {
        return this._started;
    }

    stop() {
        this._browserSync.exit();
    }
}
