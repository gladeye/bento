import backEnd from "~/blocks/backEnd";
import ConfigBuilder from "~/lib/ConfigBuilder";

describe("blocks/backEnd", () => {
    const options = {
        ports: {
            browsersync: 3000,
            ui: 3001,
            webpack: 3002
        },

        proxy: {
            "/": {
                target: "http://localhost:8080",
                changeOrigin: true,
                autoRewrite: true
            }
        },
        blocks: {
            list: [backEnd]
        },
        html: {}
    };

    it("matches snapshot", () => {
        const builder = ConfigBuilder.create(Object.assign({}, {}, options));

        return builder.build().then(config => {
            expect(config).toMatchSnapshot();
        });
    });
});
