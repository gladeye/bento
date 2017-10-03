import plugins from "~/blocks/plugins";
import ConfigBuilder from "~/lib/ConfigBuilder";

describe("blocks/plugins", () => {
    const options = {
        filename: "[name]",

        paths: {
            root: process.cwd(),
            input: "./app",
            output: "./public"
        },
        files: {
            copy: "+(images|media)/**/*"
        },
        blocks: {
            list: [plugins]
        },
        enabled: {
            writeManifest: true
        }
    };

    it("matches snapshot", () => {
        const builder = ConfigBuilder.create(Object.assign({}, options));

        return builder.build().then(config => {
            expect(config).toMatchSnapshot();
        });
    });
});
