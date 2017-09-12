import WebpackDevServer from "webpack-dev-server";
import addDevServerEntrypoints from "webpack-dev-server/lib/util/addDevServerEntrypoints";

export default class WebpackDevServerController {
    static create(compiler, config) {
        return new WebpackDevServerController(compiler, config);
    }

    static addEntryPoints(config, options) {
        addDevServerEntrypoints(config, options);
    }

    constructor(compiler, options) {
        this._server = new WebpackDevServer(compiler, options);

        this._started = new Promise((resolve, reject) => {
            this._server.listen(options.port, options.host, err => {
                if (err) return reject(err);
                resolve(this);
            });
        });
    }

    get started() {
        return this._started;
    }

    get server() {
        return this._server;
    }

    stop() {
        return new Promise(resolve => {
            this._server.close(resolve);
        });
    }
}
