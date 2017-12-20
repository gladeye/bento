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
            expect(bento.export()).toMatchSnapshot();
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

            bento.addRules({ js: ["babel-loader"] });
            expect(bento.export()).toMatchSnapshot();
        });
    });
});
