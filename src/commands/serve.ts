import * as promisify from "yargs-promise-handler";

export const command = "serve";

export const describe = `Starts a development server with HMR support with configuration from \`webpack.config.js\``;

export const builder = {};

export function run(argv) {
    console.log(argv);
}

export const handler = promisify(run);
