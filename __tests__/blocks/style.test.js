import style from "~/blocks/style";
import ConfigBuilder from "~/lib/ConfigBuilder";

describe("blocks/style", () => {
    const options = {
        blocks: {
            babel: {},
            list: [style]
        }
    };

    it("matches snapshot", () => {
        const builder = ConfigBuilder.create(
            Object.assign(
                {},
                {
                    env: {
                        value: "development"
                    },

                    filename: "[name]"
                },
                options
            )
        );

        return builder.build().then(config => {
            expect(config).toMatchSnapshot();
        });
    });
});
