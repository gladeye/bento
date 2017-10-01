import style from "~/blocks/style";
import ConfigBuilder from "~/lib/ConfigBuilder";

describe("blocks/style", () => {
    const options = {
        filename: "[name]",

        paths: {
            root: process.cwd(),
            input: "./app"
        },
        blocks: {
            list: [style]
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
                    },

                    enabled: {
                        extractCSS: "@{env.isProduction}"
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
