import Bento, { Env } from "~/core/Bento";

describe("Bento", () => {
    function create() {
        return Bento.create({
            homeDir: "./app",
            outputDir: "./public"
        }).bundle("main", "~/scripts/main.js");
    }

    describe(".addRule()", () => {
        it("works as expected", () => {
            const bento = create();

            bento.addRule("js", "babel-loader");
            bento.tinker(manifest => {
                expect(manifest).toMatchSnapshot();
            });
        });
    });

    describe(".addRules()", () => {
        it("works as expected", () => {
            const bento = create();

            bento.addRules({ js: ["babel-loader"], css: "style-loader" });
            bento.tinker(manifest => {
                expect(manifest).toMatchSnapshot();
            });
        });
    });

    describe(".addPlugin()", () => {
        it("works as expected", () => {
            const bento = create();

            bento.addPlugin("html-webpack-plugin", []);
            bento.tinker(manifest => {
                expect(manifest).toMatchSnapshot();
            });
        });
    });

    describe(".addPlugins()", () => {
        it("works as expected", () => {
            const bento = create();

            bento.addPlugins({ "html-webpack-plugin": [] });
            bento.tinker(manifest => {
                expect(manifest).toMatchSnapshot();
            });
        });
    });

    describe(".export()", () => {
        it("works as expected in `developement` env", () => {
            const bento = create();

            bento.addPlugin("html-webpack-plugin", [
                {
                    title: "Bento"
                }
            ]);

            return bento.export().then(config => {
                expect(config).toMatchSnapshot();
            });
        });

        it("works as expected in `production` env", () => {
            const bento = create();

            return bento.export(Env.Production).then(config => {
                expect(config).toMatchSnapshot();
            });
        });
    });

    describe(".set()", () => {
        it("works as expected with `sourceMap`", () => {
            const bento = create();

            bento.set("sourceMap", false);

            return bento.export().then(config => {
                expect(config).toMatchSnapshot();
            });
        });
    });
});
