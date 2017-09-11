export default function filename(config, options) {
    const isDevServer = options.get("env.isDevServer"),
        isProduction = options.get("env.isProduction"),
        hash = options.get("caching.hash");

    options.set(
        "filename",
        isDevServer || !isProduction ? "[name]" : `[name]${hash}`
    );

    return config;
}
