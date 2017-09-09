import { createOptions } from "../utils";

describe("blocks/ports", () => {
    it("works as expected", () => {
        const mockFind = jest.fn((options, cb) => {
            expect(options.count).toBe(3);
            cb(null, [3000, 3001, 3002]);
        });

        jest.mock("openport", () => {
            return {
                find: mockFind
            };
        });

        const ports = require("~/blocks/ports"),
            options = createOptions({
                env: {
                    isDevServer: true
                }
            });

        ports(null, options).then(() => {
            expect(options.get("ports")).toMatchObject({
                browsersync: 3000,
                ui: 3001,
                webpack: 3002
            });
        });
    });
});
