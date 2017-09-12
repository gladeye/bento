import { join } from "path";
import { scaffolder, tree } from "../utils";
import { build, bundle } from "~/index";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe("config/index.js", () => {
    const scaffold = scaffolder("--default spa --no-confirm");

    afterEach(() => {
        scaffolder.restore();
    });

    it("builds webpack config that matches the snapshot", () => {
        return scaffold()
            .then(dir => {
                const options = require(join(dir, "./app/config/webpack"));
                return build(options);
            })
            .then(config => {
                expect(config).toMatchSnapshot();
            });
    });

    it("bundles using webpack correctly", () => {
        return scaffold()
            .then(dir => {
                const options = require(join(dir, "./app/config/webpack"));
                options.env = Object.assign(options.env, {
                    value: "production",
                    isProduction: true
                });

                return bundle(options).then(() => dir);
            })
            .then(dir => {
                const output = tree("./public -f -l 3", dir);
                expect(output.stdout).toMatchSnapshot();
            })
            .catch(e => {
                console.error(e);
            });
    });
});
