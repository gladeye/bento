import merge from "webpack-merge";
import { mainMedia, vendorMedia } from "~/rules";

export default function media(config, options) {
    return merge(config, {
        module: {
            rules: [mainMedia(options), vendorMedia(options)]
        }
    });
}
