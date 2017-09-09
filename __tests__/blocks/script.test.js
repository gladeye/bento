import script from "~/blocks/script";
import ConfigBuilder from "~/lib/ConfigBuilder";

describe("blocks/script", () => {
    const options = {
        blocks: {
            babel: {},
            list: [script]
        }
    };

    it("matches snapshot", () => {
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
});
