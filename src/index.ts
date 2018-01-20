import { Configuration, Entry } from "webpack";
import Bento from "./core/Bento";
import StandardBento, { Config } from "./presets/StandardBento";
import PlainBento from "./presets/PlainBento";

export function create(config: Config): StandardBento {
    return StandardBento.create(config);
}

export { StandardBento, PlainBento, Bento };
