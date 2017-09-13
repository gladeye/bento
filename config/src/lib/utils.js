import objectPath from "object-path";
import { parse as shoelace } from "@kenvunz/shoelace";
import { join, resolve as res } from "path";

export function parse(options) {
    return objectPath(shoelace(options));
}

export function resolve(options) {
    ["input", "output"].forEach(key => {
        if (!options.paths || !options.paths[key]) return;
        if (options.paths[key].indexOf(options.paths.root) === 0) return;

        options.paths[key] = res(join(options.paths.root, options.paths[key]));
    });

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
