import op from "openport";

export default function ports(config, options) {
    if (!options.get("env.isDevServer")) return;

    return new Promise((resolve, reject) => {
        op.find(
            {
                startingPort: 3000,
                endingPort: 3999,
                count: 3
            },
            (err, ports) => {
                if (err) return reject(err);

                const [browserSyncMain, browserSyncMainUI, webpack] = ports;

                options.set("ports", {
                    browserSyncMain,
                    browserSyncMainUI,
                    webpack
                });

                resolve();
            }
        );
    });
}
