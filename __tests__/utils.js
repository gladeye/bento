import op from "object-path";
import tmp from "tmp";
import shelljs from "shelljs";
import { join, resolve } from "path";
import { realpathSync } from "fs";
import webpack from "webpack";

const cwd = join(resolve(__dirname, "../"));

export function createOptions(initial = {}) {
    return op(initial);
}

export function scaffold(args, silent = true) {
    return new Promise((resolve, reject) => {
        let folder, dir;
        try {
            folder = tmp.dirSync();
            dir = realpathSync(folder.name);

            shelljs.cd(dir);
            shelljs.exec(`ln -s ${cwd}/node_modules`);
            shelljs.exec("mkdir -p ./node_modules/@gladeye");
            shelljs.cd("./node_modules/@gladeye");
            shelljs.exec(`ln -sf ${cwd}`);
            shelljs.cd(dir);
            shelljs.exec(
                `npx yo ./node_modules/@gladeye/bento/scaffold ${args}`,
                { silent }
            );
        } catch (e) {
            return reject(e);
        }
        resolve(dir);
    });
}

scaffold.restore = function() {
    shelljs.cd(cwd);
};

export function scaffolder(args) {
    let tmpDir;

    return function(silent = true) {
        if (tmpDir) {
            shelljs.cd(tmpDir);
            return Promise.resolve(tmpDir);
        }

        return scaffold(args, silent).then(dir => {
            return (tmpDir = dir);
        });
    };
}

export function bundle(config) {
    return new Promise((resolve, reject) => {
        webpack(config, (err, stats) => {
            if (err) return reject(err);
            resolve(stats);
        });
    });
}
