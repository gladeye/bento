import * as promisify from "yargs-promise-handler";

export const command = "bundle";

export const describe = `Bundles asset with configuration from \`webpack.config.js\``;

export const builder = {};

export function run(argv) {
    console.log(argv);
}

export const handler = promisify(run);
