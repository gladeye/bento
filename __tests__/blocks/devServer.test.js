import devServer from "~/blocks/devServer";
import ConfigBuilder from "~/lib/ConfigBuilder";

describe("blocks/devServer", () => {
    const options = {
        ports: {
            browsersync: 3000,
            ui: 3001,
            webpack: 3002
        },
        blocks: {
            list: [devServer]
        }
    };

    it("matches snapshot", () => {
        const builder = ConfigBuilder.create(Object.assign({}, {}, options));

        return builder.build().then(config => {
            expect(config).toMatchSnapshot();
        });
    });
});
