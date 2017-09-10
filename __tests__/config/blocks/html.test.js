import html from "~/blocks/html";
import ConfigBuilder from "~/lib/ConfigBuilder";

describe("blocks/html", () => {
    const options = {
        html: {},
        blocks: {
            list: [html]
        }
    };

    it("matches snapshot", () => {
        const builder = ConfigBuilder.create(Object.assign({}, {}, options));

        return builder.build().then(config => {
            expect(config).toMatchSnapshot();
        });
    });
});
