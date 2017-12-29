import Bento, { BaseConfig } from "~/core/Bento";

export default class PlainBento extends Bento {
    /**
     * Convenient method to create an instance of Bento
     *
     * @static
     * @param {BaseConfig} config
     * @param {string} [cwd]
     * @returns {PlainBento}
     * @memberof PlainBento
     */
    public static create(config: BaseConfig, cwd?: string): PlainBento {
        return new PlainBento(config, cwd);
    }
}
