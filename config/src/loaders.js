import merge from "lodash/merge";

function m(base, override) {
    return merge({}, base, override);
}

export function babel(options, override = {}) {
    return m(
        {
            loader: "babel-loader",
            options: options.get("babel")
        },
        override || {}
    );
}

export function css(options, override = {}) {
    return m(
        {
            loader: "css-loader",
            options: {
                sourceMap: options.get("enabled.sourceMap")
            }
        },
        override
    );
}

export function postcss(options, override = {}) {
    return m(
        {
            loader: "postcss-loader",
            options: {
                ident: "postcss",
                plugins: () => {
                    const autoprefixer = require("autoprefixer");
                    const browsers = options.get("browserslist");

                    return [
                        autoprefixer({
                            browsers
                        })
                    ];
                },
                sourceMap: options.get("enabled.sourceMap")
            }
        },
        override
    );
}

export function url(options, override = {}) {
    return m(
        {
            loader: "resolve-url-loader",
            options: {
                sourceMap: options.get("enabled.sourceMap")
            }
        },
        override
    );
}

export function sass(options, override = {}) {
    let importer;

    if (options.get("enabled.magicImporter")) {
        importer = [require("node-sass-magic-importer")()];
    }

    return m(
        {
            loader: "sass-loader",
            options: {
                sourceMap: options.get("enabled.sourceMap"),
                importer
            }
        },
        override
    );
}

export function file(options, override = {}) {
    return m(
        {
            loader: "file-loader",
            options: {
                name: `[path]${options.get("filename")}.[ext]`
            }
        },
        override
    );
}
