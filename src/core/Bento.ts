export interface BaseConfig {
    homeDir: string;
    outputDir: string;
    entry: {};
}
/**
 * Main class of the library
 *
 * @export
 * @class Bento
 */
export default class Bento {
    private config: BaseConfig;

    /**
     * Convenient method to create an instance of Bento
     *
     * @static
     * @param {BaseConfig} config
     * @returns {Bento}
     * @memberof Bento
     */
    public static create(config: BaseConfig): Bento {
        return new Bento(config);
    }

    /**
     * Creates an instance of Bento.
     *
     * @param {BaseConfig} config
     * @memberof Bento
     */
    public constructor(config: BaseConfig) {
        this.config = config;
    }
}
