import base from "~/blocks/base";
import ConfigBuilder from "~/lib/ConfigBuilder";

describe("blocks/base", () => {
    const options = {
        paths: {
            root: process.cwd(),
            input: "./app",
            output: "./public",
            public: "/"
        },

        entry: {
            main: ["./main.js"]
        },

        filename: "[name]",

        blocks: {
            list: [base]
        },

        resolve: {}
    };

    it("matches snapshot when in development", () => {
        const builder = ConfigBuilder.create(
            Object.assign(
                {},
                {
                    env: {
                        value: "development"
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
                        value: "production"
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
