import { join } from "path";
import shelljs from "shelljs";
import { scaffolder, request } from "../utils";
import { build, bundle, serve } from "~/index";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

describe("config/index.js", () => {
    describe("Single Page Application", () => {
        const scaffold = scaffolder("--default spa --no-confirm");

        afterEach(() => {
            scaffolder.restore();
        });

        test(scaffold, "./app", "./public/manifest.json");

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

        test(scaffold, "./assets", "./public/assets/manifest.json");

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

function test(scaffold, path, manifest) {
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
                shelljs.cp(
                    "-R",
                    join(__dirname, "__fixtures__/build/*"),
                    join(dir, path)
                );

                const options = require(join(dir, `${path}/config/webpack`));
                options.env = Object.assign(options.env, {
                    value: "production",
                    isProduction: true
                });

                return bundle(options).then(() => dir);
            })
            .then(dir => {
                const json = require(join(dir, manifest));
                expect(json).toMatchSnapshot();
            })
            .catch(e => {
                console.error(e);
            });
    });
}
