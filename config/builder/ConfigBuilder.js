const { Config } = require("webpack-config"),
    parse = require("./modules/parse");

module.exports = class ConfigBuilder {
    static create(options = {}) {
        return new ConfigBuilder(options);
    }

    constructor(options = {}) {
        this._options = parse(options);
        this._config = new Config();
        this._modules = [];
        this._manifest = {};
    }

    use(...modules) {
        this._modules = this._modules.concat(modules);
        return this;
    }

    build(fn) {
        this._modules.push(fn);

        return new Promise((resolve, reject) => {
            let i = -1,
                modules = this._modules,
                // Resolve array length to a valid (ToUint32) number.
                len = modules.length >>> 0;

            let config = new Config(),
                options = this._options;

            try {
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

                    result = modules[i].call(
                        {
                            async() {
                                async = true;
                                return next;
                            }
                        },
                        config,
                        options
                    );
                    if (!async) {
                        next(result);
                    }
                })();
            } catch (e) {
                reject(e);
            }
        });
    }
};
