import { join } from "path";
import { scaffold, scaffolder, bundle } from "../utils";
import tree from "directory-tree";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe("webpack.config.js", () => {
    let env;
    beforeEach(() => {
        env = process.env.NODE_ENV;
        process.env.NODE_ENV = "production";
    });

    afterEach(() => {
        scaffold.restore();
        process.env.NODE_ENV = env;
    });

    describe("Single Page Application", () => {
        const scaffold = scaffolder("--default spa --no-confirm");

        it("build options matches snapshot", () => {
            return scaffold().then(dir => {
                const options = require(join(dir, "./app/config/webpack"));
                expect(options).toMatchSnapshot();
            });
        });

        it("webpack bundles correctly", () => {
            let tmpDir;

            return scaffold()
                .then(dir => {
                    tmpDir = dir;
                    return require(join(dir, "./webpack.config.js"));
                })
                .then(bundle)
                .then(() => {
                    expect(tree(`${tmpDir}/public`)).toMatchSnapshot();
                });
        });
    });

    describe("Server Side Application", () => {
        const scaffold = scaffolder("--default ssa --no-confirm");

        it("build options matches snapshot", () => {
            return scaffold().then(dir => {
                const options = require(join(dir, "./assets/config/webpack"));
                expect(options).toMatchSnapshot();
            });
        });

        it("webpack bundles correctly", () => {
            let tmpDir;

            return scaffold()
                .then(dir => {
                    tmpDir = dir;
                    return require(join(dir, "./webpack.config.js"));
                })
                .then(bundle)
                .then(() => {
                    expect(tree(`${tmpDir}/public`)).toMatchSnapshot();
                });
        });
    });
});
