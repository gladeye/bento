import { basename, dirname } from "path";

export default class ManifestKeeper {
    data = null;

    constructor(data = {}) {
        this.data = data;
    }

    formatter(publicPath = "") {
        return function replacer(key, value) {
            if (typeof value === "string") {
                return value;
            }
            const manifest = value;
            /**
             * Hack to prepend scripts/ or styles/ to manifest keys
             *
             * This might need to be reworked at some point.
             *
             * Before:
             *   {
             *     "main.js": "scripts/main_abcdef.js"
             *     "main.css": "styles/main_abcdef.css"
             *   }
             * After:
             *   {
             *     "scripts/main.js": "scripts/main_abcdef.js"
             *     "styles/main.css": "styles/main_abcdef.css"
             *   }
             */
            Object.keys(manifest).forEach(src => {
                const sourcePath = basename(dirname(src));
                const targetPath = basename(dirname(manifest[src]));
                if (sourcePath === targetPath) {
                    return;
                }
                manifest[`${targetPath}/${src}`] = `${publicPath}${manifest[
                    src
                ]}`;
                delete manifest[src];
            });
            return manifest;
        };
    }
}
