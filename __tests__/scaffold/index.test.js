import { scaffold } from "../utils";
import shelljs from "shelljs";

describe("Scaffolding", () => {
    afterEach(() => {
        scaffold.restore();
    });

    describe("Single Page Application", () => {
        it("folder structure matches the snapshot", () => {
            return scaffold("--default spa --no-confirm").then(dir => {
                const result = shelljs.exec(
                    "tree ./ --ignore node_modules/ -f -l 4",
                    {
                        cwd: dir,
                        silent: true
                    }
                );

                const output = result.stdout.replace(dir, "./");
                expect(output).toMatchSnapshot();
            });
        });
    });

    describe("Server Side Application", () => {
        it("folder structure matches the snapshot", () => {
            return scaffold("--default ssa --no-confirm").then(dir => {
                const result = shelljs.exec(
                    "tree ./ --ignore node_modules/ -f -l 4",
                    {
                        cwd: dir,
                        silent: true
                    }
                );

                const output = result.stdout.replace(dir, "./");
                expect(output).toMatchSnapshot();
            });
        });
    });
});
