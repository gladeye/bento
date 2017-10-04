import { join } from "path";
import { scaffolder, tree, request } from "../utils";
import { build, bundle, serve } from "~/index";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe("config/index.js", () => {
    describe("Single Page Application", () => {
        const scaffold = scaffolder("--default spa --no-confirm");

        afterEach(() => {
            scaffolder.restore();
        });

        test(scaffold, "./app");

        it("serves using webpack-dev-server correctly", () => {
            return scaffold().then(dir => {
                const options = require(join(dir, `./app/config/webpack`));
                options.env = Object.assign(options.env, {
                    value: "development",
                    isProduction: false,
                    isDevServer: true
                });

                options.browsersync = {
                    open: false,
                    logLevel: "silent"
                };

                return serve(options, (server, done) => {
                    const req = request(server.app);

                    Promise.all([
                        req
                            .get("/")
                            .accept("html")
                            .expect(200)
                            .test(),
                        req
                            .get("/scripts/main.js")
                            .expect("Content-Type", /javascript/)
                            .expect(200)
                            .test()
                    ]).then(() => {
                        done();
                    });
                });
            });
        });
    });

    describe("Server Side Application", () => {
        const scaffold = scaffolder("--default ssa --no-confirm");

        afterEach(() => {
            scaffolder.restore();
        });

        test(scaffold, "./assets");

        it("serves using webpack-dev-server correctly", () => {
            return scaffold().then(dir => {
                const options = require(join(dir, `./assets/config/webpack`));
                options.env = Object.assign(options.env, {
                    value: "development",
                    isProduction: false,
                    isDevServer: true
                });

                options.browsersync = {
                    open: false,
                    logLevel: "silent"
                };

                options.proxy = {
                    "**": {
                        target: "http://gladeye.com/"
                    }
                };

                return serve(options, (server, done) => {
                    const req = request(server.app);

                    Promise.all([
                        req
                            .get("/")
                            .accept("html")
                            .expect(301)
                            .test(),
                        req
                            .get("/scripts/main.js")
                            .expect("Content-Type", /javascript/)
                            .expect(200)
                            .test()
                    ]).then(() => {
                        done();
                    });
                });
            });
        });
    });
});

function test(scaffold, path) {
    it("builds webpack config that matches the snapshot", () => {
        return scaffold()
            .then(dir => {
                const options = require(join(dir, `${path}/config/webpack`));
                return build(options);
            })
            .then(config => {
                expect(config).toMatchSnapshot();
            });
    });

    it("bundles using webpack correctly", () => {
        return scaffold()
            .then(dir => {
                const options = require(join(dir, `${path}/config/webpack`));
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
}
