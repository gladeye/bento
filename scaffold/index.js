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

        this.log(chalk.grey("---"));
    }

    prompting() {
        const prompt = this.prompt([
            {
                type: "input",
                name: "config",
                message: `Where should the ${chalk.underline(
                    "config file"
                )} be:`,
                default: "./webpack.config.js"
            },

            {
                type: "input",
                name: "input",
                message: `Where should the ${chalk.underline(
                    "input folder"
                )} be:`,
                default: "./assets/"
            },

            {
                type: "input",
                name: "output",
                message: `Where should the ${chalk.underline(
                    "output folder"
                )} be:`,
                default: "./public/assets/"
            },

            {
                type: "input",
                name: "public",
                message: `What should the ${chalk.underline(
                    "public path"
                )} be:`,
                default: "/assets/"
            },

            {
                type: "confirm",
                name: "server",
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
                    return answers["server"];
                },
                default: "http://localhost:8080"
            }
        ]).then(answers => {
            this.log(chalk.grey("---"));

            for (let key in answers) {
                const value = answers[key];

                let label,
                    val = value;

                switch (key) {
                    case "config":
                        label = "Config file";
                        val = this.destinationPath(value);
                        break;
                    case "input":
                        label = "Input folder";
                        val = this.destinationPath(value);
                        break;
                    case "output":
                        label = "Output folder";
                        val = this.destinationPath(value);
                        break;
                    case "public":
                        label = "Public path";
                        val = `${chalk.grey("<URL>")}${value}`;
                        break;
                    case "proxy":
                        label = "Back-end URL";
                        break;
                }

                if (label) {
                    this.log(
                        chalk.grey(`> ${label}: ${chalk.bold.white(val)}`)
                    );
                }
            }

            this.log("");

            return this.prompt([
                {
                    type: "confirm",
                    name: "proceed",
                    message: "Proceed:",
                    default: true
                }
            ]).then(result => {
                answers.proceed = result.proceed;
                return answers;
            });
        });

        return prompt.then(answers => {
            if (!answers.proceed) return;
            this.props = Object.assign({}, this.props, answers);
        });
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath("webpack.config.js.tpl"),
            this.props.config,
            this.props
        );

        this.fs.copy(this.templatePath("assets/**/*"), this.props.input, {
            globOptions: {
                dot: true
            }
        });
    }
};
