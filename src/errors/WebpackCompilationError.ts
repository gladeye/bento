import { BaseError } from "make-error";
import { Stats } from "webpack";

export default class WebpackCompilationError extends BaseError {
    constructor(stats: Stats) {
        super(stats.toJson().errors);
    }
}
