import ConfigBuilder from "~/lib/ConfigBuilder";
import { caught } from "~/lib/utils";
import _bundle from "~/lib/bundle";
import _serve from "~/lib/serve";

export { base as config } from "~/lib/config";

export function build(options) {
    return ConfigBuilder.create(options)
        .build()
        .catch(caught);
}

export function bundle(options) {
    return build(options)
        .then(config => {
            return _bundle(config);
        })
        .catch(caught);
}

export function serve(options, cb) {
    return build(options)
        .then(config => {
            return _serve(config, cb);
        })
        .catch(caught);
}
