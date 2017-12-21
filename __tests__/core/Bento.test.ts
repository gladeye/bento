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

    describe(".addPlugin()", () => {
        it("works as expected", () => {
            const bento = Bento.create({
                homeDir: "app",
                outputDir: "public",
                entry: {
                    main: "scripts/main.js"
                }
            });

            bento.addPlugin("html-webpack-plugin", []);
            bento.export(manifest => {
                expect(manifest).toMatchSnapshot();
            });
        });
    });

    describe(".addPlugins()", () => {
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

    describe(".export()", () => {
        it("works as expected in `developement` env", () => {
            const bento = Bento.create({
                homeDir: "app",
                outputDir: "public",
                entry: {
                    main: "scripts/main.js"
                }
            });

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
            const bento = Bento.create(
                {
                    homeDir: "app",
                    outputDir: "public",
                    entry: {
                        main: "scripts/main.js"
                    }
                },
                "production"
            );

            return bento.export().then(config => {
                expect(config).toMatchSnapshot();
            });
        });
    });

    describe(".set()", () => {
        it("works as expected with `sourceMap`", () => {
            const bento = Bento.create(
                {
                    homeDir: "app",
                    outputDir: "public",
                    entry: {
                        main: "scripts/main.js"
                    }
                },
                "production"
            );

            bento.set("sourceMap", false);

            return bento.export().then(config => {
                expect(config).toMatchSnapshot();
            });
        });
    });
});
