const path = require("path"),
    assert = require("yeoman-assert"),
    yo = require("yeoman-test"),
    { execSync } = require("child_process");

describe("scaffold:spa", () => {
    const tmpDir = path.join(__dirname, "../../.tmp/spa");

    beforeEach(() => {
        return new Promise(resolve => {
            yo.testDirectory(tmpDir, () => {
                execSync("yarn link @gladeye/bento", {
                    cwd: tmpDir
                });

                resolve();
            });
        });
    });

    it("generates correct folder structure and webpack builds successfully", () => {
        return yo
            .run(path.join(__dirname, "../../scaffold"), { tmpdir: false })
            .withOptions({ default: "spa" })
            .withPrompts({ proceed: true })
            .then(() => {
                execSync("NODE_ENV=production webpack", {
                    cwd: tmpDir
                });

                const files = [
                    "webpack.config.js",
                    "app/index.ejs",
                    "app/scripts/main.js",
                    "app/styles/main.scss"
                ];

                const assets = require(path.join(tmpDir, "public/assets.json"));

                for (let i in assets) {
                    files.push(`public/${assets[i]}`);
                }

                assert.file(files);
            });
    });
});

describe("scaffold:ssa", () => {
    const tmpDir = path.join(__dirname, "../../.tmp/ssa");

    beforeEach(() => {
        return new Promise(resolve => {
            yo.testDirectory(tmpDir, () => {
                execSync("yarn link @gladeye/bento", {
                    cwd: tmpDir
                });

                resolve();
            });
        });
    });

    it("generates correct folder structure and webpack builds successfully", () => {
        return yo
            .run(path.join(__dirname, "../../scaffold"), { tmpdir: false })
            .withOptions({ default: "ssa" })
            .withPrompts({ proceed: true })
            .then(() => {
                execSync("NODE_ENV=production webpack", {
                    cwd: tmpDir
                });

                const files = [
                    "webpack.config.js",
                    "assets/scripts/main.js",
                    "assets/styles/main.scss"
                ];

                const assets = require(path.join(
                    tmpDir,
                    "public/assets/assets.json"
                ));

                for (let i in assets) {
                    files.push(`public/assets/${assets[i]}`);
                }

                assert.file(files);
            });
    });
});
