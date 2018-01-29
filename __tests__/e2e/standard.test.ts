import { resolve as resolvePath } from "path";
import * as execa from "execa";
import { Configuration } from "webpack";
import * as express from "express";
import * as fetch from "node-fetch";
import StandardBento from "~/presets/StandardBento";
import WebpackController from "~/core/WebpackController";
import { Env } from "~/core/Bento";

describe("serve", () => {
    const serve = function(cb) {
        return new Promise((resolve, reject) => {
            const cliPath = resolvePath(
                __dirname,
                "../../node_modules/.bin/webpack-dev-server"
            );
            const fixturePath = resolvePath(__dirname, "./serve");
            const nodePath = execa.shellSync("which node").stdout;

            const proc = execa(
                nodePath,
                [cliPath, "--hot", "--inline", "--port", "8000"],
                {
                    cwd: fixturePath
                }
            );

            proc.stdout.on("data", cb.bind(null, proc));
            proc.stderr.on("data", reject);
            proc.on("exit", resolve);
            proc.on("error", reject);
        });
    };

    const proxy = function() {
        const server = express();
        server.get("/", (req, res) => {
            res.send("proxy says hi");
        });

        return server.listen(9000);
    };

    it(
        "should work as expected",
        async () => {
            const server = proxy();

            await serve(async (proc, data) => {
                const done = function() {
                    server.close();
                    proc.kill("SIGINT");
                };

                const output = data.toString();
                if (!/Compiled successfully/.test(output)) return;

                const mainBody = await (await fetch(
                    "http://localhost:8000"
                )).text();

                const proxyBody = await (await fetch(
                    "http://localhost:8000/api"
                )).text();

                expect(mainBody).toContain("<title>Webpack App</title>");
                expect(mainBody).toContain(
                    `<script type="text/javascript" src="/main.js"></script>`
                );

                expect(proxyBody).toContain("proxy says hi");

                done();
            });
        },
        120000
    );
});

describe("build", () => {
    const build = function(
        entry,
        env?: string,
        overwrite?: (config: Configuration) => any
    ) {
        const bento = StandardBento.create({
            homeDir: "./__tests__",
            outputDir: "/"
        }).bundle("main", `~/fixtures/${entry}.js`);

        const files = {};

        return bento.export(env).then(config => {
            if (overwrite) overwrite(config);

            config.devtool = false;
            const controller = new WebpackController(config);
            const promise = controller.compile();

            controller.compiler.outputFileSystem.writeFile = function(
                name,
                content,
                callback
            ) {
                files[name] = content.toString("utf-8");
                callback();
            };

            return promise.then(stats => {
                return { files, stats };
            });
        });
    };

    it("exports a correct `config` for webpack", () => {
        return build("main2").then(({ files, stats }) => {
            expect(Object.keys(files)).toEqual([
                "/RobotoMono-Regular.ttf",
                "/giphy.gif",
                "/nice.jpg",
                "/cat.gif",
                "/main.js",
                "/manifest.json"
            ]);
            const bundle = files["/main.js"];

            expect(bundle).toContain("function __webpack_require__(");
            expect(bundle).toContain("__webpack_require__(/*! ~/fixtures/a */");
            expect(bundle).toContain("__webpack_require__(/*! ./style.scss */");
            expect(bundle).toContain("./__tests__/fixtures/main2.js");
            expect(bundle).toContain("./__tests__/fixtures/a.js");
            expect(bundle).toContain("./__tests__/fixtures/b.js");
            expect(bundle).toContain(
                "./__tests__/fixtures/node_modules/m1/a.js"
            );
            expect(bundle).toContain(
                "./__tests__/fixtures/node_modules/m1/s.css"
            );
            expect(bundle).toContain("This is a");
            expect(bundle).toContain("This is b");
            expect(bundle).toContain("This is m1/a");
            expect(bundle).toContain("var x = 1;");
            expect(bundle).toContain("color: red;");
            expect(bundle).toContain("font-size: 12px;");
            expect(bundle).toContain("console.log(undefined);");

            expect(bundle).not.toContain("4: function(");
            // expect(bundle).not.toContain("window");
            expect(bundle).not.toContain("jsonp");

            expect(JSON.parse(files["/manifest.json"])).toMatchSnapshot();
        });
    });

    it("exports a correct `config` for webpack in production", () => {
        return build("main2", Env.Production).then(({ files, stats }) => {
            const keys = Object.keys(files);
            expect(keys).toEqual([
                "/RobotoMono-Regular.a48ac416.ttf",
                "/giphy.a47e713b.gif",
                "/cat.5082946a.gif",
                "/nice.9c3c4150.jpg",
                "/main.3725e6c4.js",
                "/runtime.9b99d594.js",
                "/vendor.82d73bc4.js",
                "/main.bd753fff.css",
                "/manifest.json"
            ]);

            expect(files["/main.3725e6c4.js"]).toContain(`return\"This is a\"`);
            expect(files["/main.bd753fff.css"]).toContain("color:red");
            expect(files["/main.bd753fff.css"]).toContain("@-webkit-keyframes");
            expect(JSON.parse(files["/manifest.json"])).toMatchSnapshot();
        });
    });

    // ref: https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
    it("keeps `vendor` chunk hash as static as possible", async () => {
        const find = (name, files) => {
            return Object.keys(files)
                .filter(item => {
                    return item.indexOf(`/${name}`) === 0;
                })
                .shift();
        };

        // default
        const a = await build("main3-a", Env.Production);
        // change to entry
        const b = await build("main3-b", Env.Production);
        // load additional module async
        const c = await build("main3-c", Env.Production);
        // define `externals`
        const d = await build("main3-d", Env.Production, config => {
            config.externals = {
                jquery: "jQuery"
            };
            return config;
        });

        expect(find("vendor", b.files)).toBe(find("vendor", a.files));
        expect(find("vendor", c.files)).toBe(find("vendor", a.files));
        expect(find("vendor", d.files)).toBe(find("vendor", a.files));
    });
});
