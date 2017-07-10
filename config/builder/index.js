const { Config } = require("webpack-config"),
    parse = require("./modules/parse"),
    resolve = require("./modules/resolve"),
    select = require("./modules/select"),
    format = require("./modules/format");

module.exports = class ConfigBuilder {
    static create(options = {}) {
        return new ConfigBuilder(options);
    }

    constructor(options = {}) {
        this._options = parse(resolve(options));
        this._modules = [];
        this._manifest = {};
    }

    use(modules, timeout = 3000) {
        this._timeout = timeout;
        this._modules = this._modules.concat(modules);
        return this;
    }

    build(fn) {
        if (fn) this._modules.push(fn);

        return new Promise((resolve, reject) => {
            let i = -1,
                modules = this._modules,
                // Resolve array length to a valid (ToUint32) number.
                len = modules.length >>> 0;

            const timeout = this._timeout;

            let config = new Config(),
                options = this._options,
                utils = { select: select(this), format };

            (function next(err) {
                let async;

                // Increment counter variable and skip any indices that
                // don't exist. This allows sparse arrays to be iterated.
                do {
                    ++i;
                } while (!(i in modules) && i !== len);

                if (err === false || err) return reject(err);

                if (i === len) return resolve(config.toObject());

                let result;

                try {
                    result = modules[i](config, options, utils);
                } catch (e) {
                    return reject(e);
                }

                if (result && result.then) {
                    const id = setTimeout(function() {
                        if (!async) return;

                        throw new Error(
                            `Timeout of ${timeout} ms exceeded. For async blocks, ensure the returned promise is resolved.`
                        );
                    }, timeout);

                    const done = function(result) {
                        clearTimeout(id);
                        next(result);
                    };

                    async = true;
                    result.then(done, done);
                }

                if (!async) {
                    next(result);
                }
            })();
        });
    }

    get options() {
        return this._options;
    }
};
