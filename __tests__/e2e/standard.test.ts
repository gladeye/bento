import StandardBento from "~/presets/StandardBento";
import WebpackCompiler from "~/core/WebpackCompiler";
import { Env } from "~/core/Bento";

describe("build", () => {
    const build = function(entry, env?: Env) {
        const bento = StandardBento.create({
            homeDir: "./__tests__",
            outputDir: "/"
        }).bundle("main", `~/fixtures/${entry}.js`);

        const compiler = new WebpackCompiler();
        const files = {};

        return bento.export(env).then(config => {
            config.devtool = false;
            const promise = compiler.compile(config);

            compiler.webpack.outputFileSystem.writeFile = function(
                name,
                content,
                callback
            ) {
                files[name] = content.toString("utf-8");
                callback();
            };

            return promise.then(stats => {
                return [files, stats];
            });
        });
    };

    it("exports a correct `config` for webpack", () => {
        return build("main2").then(([files, stats]) => {
            expect(Object.keys(files)).toEqual([
                "/RobotoMono-Regular.ttf",
                "/giphy.gif",
                "/cat.gif",
                "/nice.jpg",
                "/main.js"
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
        });
    });

    // it.only("exports a correct `config` for webpack in production", () => {
    //     return build("main2", "production").then(([files, stats]) => {
    //         console.log(Object.keys(files));

    //         console.log(files["/main.e9e46029.css"]);
    //     });
    // });
});
