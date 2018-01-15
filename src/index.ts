import { Configuration, Entry } from "webpack";
import Bento from "./core/Bento";
import StandardBento, { Config } from "./presets/StandardBento";
import PlainBento from "./presets/PlainBento";

export default function bento(
    config: Config,
    entry: string | string[],
    env?: string
): Promise<Configuration> {
    const instance = StandardBento.create(config);
    instance.bundle("main", entry);
    return instance.export(env).catch(e => console.error.bind(console));
}

export { StandardBento, PlainBento, Bento };

module.exports = bento;
