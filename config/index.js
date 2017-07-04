const { config, set } = require("./utils"),
    op = require("openport"),
    path = require("path");

module.exports.config = function(options, isDevServer) {
    return config((instance, env) => {
        return new Promise((resolve, reject) => {
            op.find(
                {
                    startingPort: 3000,
                    endingPort: 3999,
                    count: 2
                },
                (err, ports) => {
                    if (err) return reject(err);

                    const [browsersync, webpack] = ports;

                    // before we change the cwd value, let's resolve all the paths
                    ["input", "output"].forEach(key => {
                        options.paths[key] = path.resolve(options.paths[key]);
                    });

                    process.chdir(__dirname);

                    set(
                        Object.assign({}, options, {
                            ports: {
                                browsersync,
                                webpack
                            },
                            env: {
                                value: process.env.NODE_ENV || "development",
                                isProduction:
                                    process.env.NODE_ENV === "production"
                            },
                            filename: isDevServer
                                ? "[name]"
                                : `[name]${options.caching.hash}`,
                            manifest: {}
                        })
                    );

                    env.setAll({
                        action: isDevServer ? "serve" : "build"
                    });

                    resolve(instance.extend("actions/[action].js"));
                }
            );
        });
    });
};
