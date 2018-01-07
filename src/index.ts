import { Configuration, Entry } from "webpack";
import Bento, { BaseConfig } from "./core/Bento";
import StandardBento from "./presets/StandardBento";
import PlainBento from "./presets/PlainBento";

export default function bento(
    config: BaseConfig,
    entry: string | string[],
    env?: string
): Promise<Configuration> {
    const instance = StandardBento.create(config);
    instance.bundle("main", entry);
    return instance.export(env);
}

export { StandardBento, PlainBento, Bento };

module.exports = bento;
