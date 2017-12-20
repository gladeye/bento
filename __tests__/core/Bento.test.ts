import Bento from "~/core/Bento";

describe("Bento", () => {
    describe(".addRule()", () => {
        it("works as expected", () => {
            const bento = Bento.create({
                homeDir: "app",
                outputDir: "public",
                entry: {
                    main: "scripts/main.js"
                }
            });

            bento.addRule("js", "babel-loader");
            bento.export(manifest => {
                expect(manifest).toMatchSnapshot();
            });
        });
    });

    describe(".addRules()", () => {
        it("works as expected", () => {
            const bento = Bento.create({
                homeDir: "app",
                outputDir: "public",
                entry: {
                    main: "scripts/main.js"
                }
            });

            bento.addRules({ js: ["babel-loader"], css: "style-loader" });
            bento.export(manifest => {
                expect(manifest).toMatchSnapshot();
            });
        });
    });

    describe(".addPlugin", () => {
        it("works as expected", () => {
            const bento = Bento.create({
                homeDir: "app",
                outputDir: "public",
                entry: {
                    main: "scripts/main.js"
                }
            });

            bento.addPlugin("html-webpack-plugin");
            bento.export(manifest => {
                expect(manifest).toMatchSnapshot();
            });
        });
    });

    describe(".addPlugins", () => {
        it("works as expected", () => {
            const bento = Bento.create({
                homeDir: "app",
                outputDir: "public",
                entry: {
                    main: "scripts/main.js"
                }
            });

            bento.addPlugins({ "html-webpack-plugin": [] });
            bento.export(manifest => {
                expect(manifest).toMatchSnapshot();
            });
        });
    });
});
