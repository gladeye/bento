const { config, set } = require("./utils"),
    path = require("path");

module.exports.config = function(options, isDevServer) {
    return config((instance, env) => {
        const root = process.cwd();

        // before we change the cwd value, let's resolve all the paths
        ["input", "output"].forEach(key => {
            options.paths[key] = path.resolve(options.paths[key]);
        });

        process.chdir(__dirname);

        set(
            Object.assign({}, options, {
                root,
                env: {
                    value: process.env.NODE_ENV || "development",
                    isProduction: process.env.NODE_ENV === "production"
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

        return instance.extend("actions/[action].js");
    });
};
