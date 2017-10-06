import { scaffold, tree } from "../utils";

describe("scaffold/index.js", () => {
    afterEach(() => {
        scaffold.restore();
    });

    describe("Single Page Application", () => {
        it("folder structure matches the snapshot", () => {
            return scaffold("--default spa --no-confirm").then(dir => {
                const result = tree(
                    `./ --ignore "node_modules/, .gitkeep, .DS_Store" -a -f -l 10`,
                    dir
                );
                expect(result.stdout).toMatchSnapshot();
            });
        });
    });

    describe("Server Side Application", () => {
        it("folder structure matches the snapshot", () => {
            return scaffold("--default ssa --no-confirm").then(dir => {
                const result = tree(
                    `./ --ignore "node_modules/, .gitkeep, .DS_Store" -f -l 10`,
                    dir
                );
                expect(result.stdout).toMatchSnapshot();
            });
        });
    });
});
