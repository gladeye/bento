import script from "~/blocks/script";
import ConfigBuilder from "~/lib/ConfigBuilder";

describe("blocks/script", () => {
    const options = {
        babel: {},
        blocks: {
            list: [script]
        }
    };

    it("matches snapshot when in development", () => {
        const builder = ConfigBuilder.create(
            Object.assign(
                {},
                {
                    env: {
                        isProduction: false
                    }
                },
                options
            )
        );

        return builder.build().then(config => {
            expect(config).toMatchSnapshot();
        });
    });

    it("matches snapshot when in production", () => {
        const builder = ConfigBuilder.create(
            Object.assign(
                {},
                {
                    env: {
                        isProduction: true
                    }
                },
                options
            )
        );

        return builder.build().then(config => {
            expect(config).toMatchSnapshot();
        });
    });
});
