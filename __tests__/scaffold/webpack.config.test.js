import { join } from "path";
import { scaffold, bundle } from "../utils";
import tree from "directory-tree";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe("webpack.config.js", () => {
    afterEach(() => {
        scaffold.restore();
    });

    describe("Single Page Application", () => {
        it("build options matches snapshot", () => {
            return scaffold("--default spa --no-confirm").then(dir => {
                const options = require(join(dir, "./app/config/webpack"));
                expect(options).toMatchSnapshot();
            });
        });

        it("webpack bundles correctly", () => {
            let tmpDir;

            return scaffold("--default spa --no-confirm")
                .then(dir => {
                    tmpDir = dir;
                    process.env.NODE_ENV = "production";
                    return require(join(dir, "./webpack.config.js"));
                })
                .then(bundle)
                .then(() => {
                    expect(tree(`${tmpDir}/public`)).toMatchSnapshot();
                });
        });
    });

    // it("works with Server Side Application preset", () => {
    //     const { name: dir } = tmp.dirSync();

    //     shelljs.cd(dir);
    //     shelljs.exec(`ln -s ${cwd}/node_modules`);
    //     shelljs.exec("mkdir -p ./node_modules/@gladeye");
    //     shelljs.cd("./node_modules/@gladeye");
    //     shelljs.exec(`ln -s ${cwd}`);
    //     shelljs.cd(dir);
    //     shelljs.exec(
    //         "npx yo ./node_modules/@gladeye/bento/scaffold --default ssa --no-confirm --quiet"
    //     );
    //     const options = require(join(dir, "./assets/config/webpack"));
    //     options.paths.root = "<tmp>";
    //     expect(options).toMatchSnapshot();
    // });
});
