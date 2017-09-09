import ManifestKeeper from "~/lib/ManifestKeeper";

export default function(config, options) {
    const manifest = options.get("manifest");

    if (manifest && manifest instanceof ManifestKeeper) return;

    options.set("manifest", new ManifestKeeper());
}
