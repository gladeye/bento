import objectPath from "object-path";
import { parse as shoelace } from "@kenvunz/shoelace";
import { join, resolve as res, dirname } from "path";
import bl from "browserslist";
import { existsSync, readFileSync } from "fs";
import querystring from "querystring";
import merge from "lodash/merge";

export function enhance(options) {
    return objectPath(options);
}

export function resolve(options) {
    ["input", "output"].forEach(key => {
        if (
            !options.paths ||
            !options.paths[key] ||
            options.paths[key].indexOf(options.paths.root) === 0
        )
            return;

        options.paths[key] = res(join(options.paths.root, options.paths[key]));
    });

    return options;
}

export function browsersync(options) {
    if (!options.paths || !options.paths.input) return options;
    options.browsersync = merge(
        browsersyncrc(options.paths.input),
        options.browsersync || {}
    );
    return options;
}

export function browserslist(options) {
    if (!options.paths || !options.paths.input) return options;
    options.browserslist = merge(
        browserslistrc(options.paths.input),
        options.browserslist || {}
    );
    return options;
}

export function babel(options) {
    if (!options.paths || !options.paths.input) return options;
    options.babel = merge(babelrc(options.paths.input), options.babel || {});
    return options;
}

export function transform(
    options,
    fns = [resolve, browserslist, browsersync, babel, shoelace, enhance]
) {
    for (const fn of fns) {
        options = fn(options);
    }

    return options;
}

export function select(options) {
    return function(cases) {
        return cases[options.get("env.value")];
    };
}

export function caught(e) {
    if (process.env.NODE_ENV === "test") throw e;
    console.error(e);
}

function browsersyncrc(path) {
    return rc(path, [
        "bs-config.js",
        ".browsersyncrc",
        "package.json?key=browsersync"
    ]);
}

function babelrc(path) {
    return rc(path, [".babelrc", "package.json?key=babel"]);
}

function browserslistrc(path) {
    const config = bl.findConfig(path);
    if (!config) return bl.defaults;

    if (config[process.env.NODE_ENV]) return config[process.env.NODE_ENV];
    return config.defaults;
}

function rc(path, files) {
    for (const item of files) {
        const [name, query] = item.split("?");
        const file = join(path, name);
        if (!existsSync(file)) continue;
        let options;
        if (query) options = querystring.parse(query);

        const object = JSON.parse(readFileSync(file));

        if (name !== "package.json") return object;
        return options && options.key ? object[options.key] : options;
    }

    const up = dirname(path);

    if (up !== path) {
        return rc(up, files);
    }
}
