import { Configuration, Entry } from "webpack";
import Bento from "./core/Bento";
import StandardBento, { Config } from "./presets/StandardBento";
import PlainBento from "./presets/PlainBento";

export default function make(
    config: Config,
    entry: string | string[] = null,
    env?: string
): Promise<Configuration> | StandardBento {
    const instance = StandardBento.create(config);
    if (!entry) return instance;

    return instance
        .bundle("main", entry)
        .export(env)
        .catch(e => console.error.bind(console));
}

export { StandardBento, PlainBento, Bento };

module.exports = make;
