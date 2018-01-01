import { Configuration } from "webpack";
import Bento, { BaseConfig } from "~/core/Bento";
import StandardBento from "~/presets/StandardBento";
import PlainBento from "~/presets/PlainBento";

export default function bento(
    config: BaseConfig,
    env?: string
): Promise<Configuration> {
    const instance = StandardBento.create(config);
    return instance.export(env);
}

export { StandardBento, PlainBento, Bento };
