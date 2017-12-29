import PlainBento from "~/presets/PlainBento";
import WebpackCompiler from "~/core/WebpackCompiler";

describe("build", () => {
    const build = function(entry) {
        const bento = PlainBento.create({
            homeDir: "./__tests__",
            outputDir: "/"
        }).bundle("main", `~/fixtures/${entry}.js`);

        const compiler = new WebpackCompiler();
        const files = {};

        return bento.export().then(config => {
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

    it("exports a compatible working `config` for webpack", () => {
        return build("main1").then(([files, stats]) => {
            expect(Object.keys(files)).toEqual(["/main.js"]);
            const bundle = files["/main.js"];

            expect(bundle).toContain("function __webpack_require__(");
            expect(bundle).toContain("__webpack_require__(/*! ./a */");
            expect(bundle).toContain("./__tests__/fixtures/main1.js");
            expect(bundle).toContain("./__tests__/fixtures/a.js");
            expect(bundle).toContain("./__tests__/fixtures/b.js");
            expect(bundle).toContain(
                "./__tests__/fixtures/node_modules/m1/a.js"
            );
            expect(bundle).toContain("This is a");
            expect(bundle).toContain("This is b");
            expect(bundle).toContain("This is m1/a");
            expect(bundle).not.toContain("4: function(");
            expect(bundle).not.toContain("window");
            expect(bundle).not.toContain("jsonp");
        });
    });
});
