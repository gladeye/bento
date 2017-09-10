import filename from "~/blocks/filename";
import { createOptions } from "../../utils";

describe("blocks/filename", () => {
    it("works as expected in dev-server mode", () => {
        const options = createOptions({
            env: {
                isDevServer: true,
                isProduction: false
            }
        });

        filename(null, options);

        expect(options.get("filename")).toBe("[name]");
    });
});
