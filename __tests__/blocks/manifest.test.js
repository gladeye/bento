import ManifestKeeper from "~/lib/ManifestKeeper";
import manifest from "~/blocks/manifest";
import { createOptions } from "../utils";

describe("blocks/manifest", () => {
    it("works as expected", () => {
        const options = createOptions({});

        manifest(null, options);

        expect(options.get("manifest")).toBeInstanceOf(ManifestKeeper);
    });

    it("will not instantiate new ManifestKeeper if there is one", () => {
        const options = createOptions({
            manifest: new ManifestKeeper({ foo: "baz" })
        });

        manifest(null, options);

        expect(options.get("manifest")).toBeInstanceOf(ManifestKeeper);
        expect(options.get("manifest").data).toMatchObject({ foo: "baz" });
    });
});
