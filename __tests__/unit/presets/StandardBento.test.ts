import StandardBento from "~/presets/StandardBento";

describe("StandardBento", () => {
    it("works as expected", () => {
        const bento = StandardBento.create({
            homeDir: "app",
            outputDir: "public"
        });

        bento.tinker(manifest => {
            expect(manifest).toMatchSnapshot();
        });
    });
});
