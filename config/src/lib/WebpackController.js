import webpack from "webpack";

export default class WebpackController {
    static create(config) {
        return new WebpackController(config);
    }

    constructor(config) {
        this._config = config;
        this._compiler = null;
        this._stats = null;
    }

    get config() {
        return this._config;
    }

    get compiler() {
        return this._compiler;
    }

    get stats() {
        return this._stats;
    }

    bundle() {
        return new Promise((resolve, reject) => {
            this._compiler = webpack(this._config, (err, stats) => {
                if (err) return reject(err);
                this._stats = stats;
                return resolve(this);
            });
        });
    }
}
