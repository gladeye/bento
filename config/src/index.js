import ConfigBuilder from "~/lib/ConfigBuilder";

export function build(options) {
    return ConfigBuilder.create(options).build();
}

export function bundle(options) {
    const WebpackController = require("~/lib/WebpackController");

    return ConfigBuilder.create(options)
        .build()
        .then(config => {
            return WebpackController.create(config).bundle();
        })
        .catch(e => {
            console.error(e);
        });
}
