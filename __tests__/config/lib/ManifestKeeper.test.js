import ManifestKeeper from "~/lib/ManifestKeeper";

describe("ManifestKeeper", () => {
    describe(".formatter()", () => {
        it("works as expected", () => {
            const keeper = new ManifestKeeper(),
                format = keeper.formatter();

            const result = format(null, {
                "main.js": "scripts/main_abcdef.js",
                "main.css": "styles/main_abcdef.css"
            });

            expect(result).toMatchObject({
                "scripts/main.js": "scripts/main_abcdef.js",
                "styles/main.css": "styles/main_abcdef.css"
            });
        });
    });
});
