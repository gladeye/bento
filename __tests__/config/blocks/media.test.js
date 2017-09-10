import media from "~/blocks/media";
import ConfigBuilder from "~/lib/ConfigBuilder";

describe("blocks/media", () => {
    const options = {
        filename: "[name]",

        paths: {
            root: process.cwd(),
            input: "./app"
        },
        blocks: {
            list: [media]
        }
    };

    it("matches snapshot", () => {
        const builder = ConfigBuilder.create(Object.assign({}, {}, options));

        return builder.build().then(config => {
            expect(config).toMatchSnapshot();
        });
    });
});
