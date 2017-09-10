import { join, resolve } from "path";
import shelljs from "shelljs";
import tmp from "tmp";

describe("webpack.config.js", () => {
    const cwd = join(resolve(__dirname, "../../"));

    afterEach(() => {
        process.chdir(cwd);
    });

    it("options to build webpack.config.js matches snapshot for Single Page Application", () => {
        const { name: dir } = tmp.dirSync();

        shelljs.cd(dir);
        shelljs.exec(`ln -s ${cwd}/node_modules`);
        shelljs.exec("mkdir -p ./node_modules/@gladeye");
        shelljs.cd("./node_modules/@gladeye");
        shelljs.exec(`ln -s ${cwd}`);
        shelljs.cd(dir);
        shelljs.exec(
            "npx yo ./node_modules/@gladeye/bento/scaffold --default spa --no-confirm --quiet"
        );
        const options = require(join(dir, "./app/config/webpack"));
        options.paths.root = "<tmp>";
        expect(options).toMatchSnapshot();
    });

    it("options to build webpack.config.js matches snapshot for Server Side Application", () => {
        const { name: dir } = tmp.dirSync();

        shelljs.cd(dir);
        shelljs.exec(`ln -s ${cwd}/node_modules`);
        shelljs.exec("mkdir -p ./node_modules/@gladeye");
        shelljs.cd("./node_modules/@gladeye");
        shelljs.exec(`ln -s ${cwd}`);
        shelljs.cd(dir);
        shelljs.exec(
            "npx yo ./node_modules/@gladeye/bento/scaffold --default ssa --no-confirm --quiet"
        );
        const options = require(join(dir, "./assets/config/webpack"));
        options.paths.root = "<tmp>";
        expect(options).toMatchSnapshot();
    });
});
