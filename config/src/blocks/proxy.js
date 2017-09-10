import merge from "merge";
import respMod from "resp-modifier";

export default function(config, options) {
    return merge(config, {
        devServer: {
            setup(app) {
                app.use(
                    respMod({
                        rules: [
                            {
                                match: new RegExp(
                                    options.get("server").proxy["/"].target,
                                    "gi"
                                ),
                                replace: `//localhost:${options.get(
                                    "ports.webpack"
                                )}`
                            }
                        ]
                    })
                );
            }
        }
    });
}
