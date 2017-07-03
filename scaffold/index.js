const Generator = require("yeoman-generator"),
    chalk = require("chalk");

module.exports = class extends Generator {
    initializing() {
        this.props = {};

        this.log(
            chalk.grey(
                `! Working folder: ${chalk.bold.white(this.destinationRoot())}`
            )
        );
    }

    prompting() {
        const prompt = this.prompt([
            {
                type: "input",
                name: "webpack",
                message: `Where should the ${chalk.underline(
                    "config file"
                )} be:`,
                default: "./webpack.config.js"
            },

            {
                type: "input",
                name: "base",
                message: `Where should the ${chalk.underline(
                    "input folder"
                )} be:`,
                default: "./assets/"
            },

            {
                type: "input",
                name: "base",
                message: `Where should the ${chalk.underline(
                    "output folder"
                )} be:`,
                default: "./public/assets/"
            },

            {
                type: "confirm",
                name: "back-end",
                message: `Does this project need to proxy to a back-end server, e.g PHP server:`,
                default: false
            },

            {
                type: "input",
                name: "proxy",
                message: `What is the ${chalk.underline(
                    "back-end server URL"
                )}:`,
                when: answers => {
                    return answers["back-end"];
                },
                default: "http://localhost:8080"
            }
        ]);

        // prompt.ui.process.subscribe(function onEachAnswer() {
        //     console.log(arguments);
        // });

        return prompt;
    }
};
