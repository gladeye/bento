const op = require("openport");

module.exports = function(config, options) {
    if (!options.get("env.isDevServer")) return;
    return new Promise((resolve, reject) => {
        op.find(
            {
                startingPort: 3000,
                endingPort: 3999,
                count: 3
            },
            (err, ports) => {
                if (err) return reject(err);

                const [browsersync, ui, webpack] = ports;

                options.set("ports", {
                    browsersync,
                    webpack
                });

                resolve();
            }
        );
    });
};
