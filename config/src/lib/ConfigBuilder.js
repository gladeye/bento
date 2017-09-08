import { parse, resolve, select } from "~/lib/utils";

export default class ConfigBuilder {
    static create(options = {}) {
        return new ConfigBuilder(options);
    }

    constructor(options = {}) {
        this._options = parse(resolve(options));
        this._blocks = options.blocks.list || [];
        this._timeout = options.blocks.timeout || 3000;
    }

    get options() {
        return this._options;
    }

    build() {
        return new Promise((resolve, reject) => {
            let i = -1,
                modules = this._blocks,
                // Resolve array length to a valid (ToUint32) number.
                len = modules.length >>> 0;

            const timeout = this._timeout;

            let config = {},
                options = this._options,
                utils = { select: select(options) };

            (function next(err) {
                let async;

                // Increment counter variable and skip any indices that
                // don't exist. This allows sparse arrays to be iterated.
                do {
                    ++i;
                } while (!(i in modules) && i !== len);

                if (err === false || err) return reject(err);

                if (i === len) return resolve(config);

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
}
