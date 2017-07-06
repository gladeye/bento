const path = require("path"),
    assert = require("yeoman-assert"),
    yo = require("yeoman-test");

describe("scaffold:spa", () => {
    it("generates correct folder structure", () => {
        return yo
            .run(path.join(__dirname, "../../scaffold"))
            .withOptions({ default: "spa" })
            .withPrompts({ proceed: true })
            .then(() => {
                assert.file([
                    "webpack.config.js",
                    "app/index.ejs",
                    "app/scripts/main.js",
                    "app/styles/main.scss",
                    "public/.gitkeep"
                ]);
            });
    });
});

describe("scaffold:ssa", () => {
    it("generates correct folder structure", () => {
        return yo
            .run(path.join(__dirname, "../../scaffold"))
            .withOptions({ default: "ssa" })
            .withPrompts({ proceed: true })
            .then(() => {
                assert.file([
                    "webpack.config.js",
                    "assets/scripts/main.js",
                    "assets/styles/main.scss",
                    "public/assets/.gitkeep"
                ]);
            });
    });
});
