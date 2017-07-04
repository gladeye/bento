const Generator = require("yeoman-generator"),
    chalk = require("chalk");

const presets = {
    spa: {
        input: "./app/",
        output: "./public/",
        public: "/"
    },

    ssa: {
        input: "./assets/",
        output: "./public/assets/",
        public: "/assets/"
    }
};

const select = function(key) {
    return function(answers) {
        return presets[answers.kind][key];
    };
};

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
        return this.prompt([
            {
                type: "list",
                name: "kind",
                message: "How should this project be described as:",
                choices: [
                    {
                        name: "Single-page Application",
                        value: "spa"
                    },

                    {
                        name: "Server-side Application",
                        value: "ssa"
                    }
                ]
            },

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
                default: select("input")
            },

            {
                type: "input",
                name: "output",
                message: `Where should the ${chalk.underline(
                    "output folder"
                )} be:`,
                default: select("output")
            },

            {
                type: "input",
                name: "public",
                message: `What should the ${chalk.underline(
                    "public path"
                )} be:`,
                default: select("public")
            },

            {
                type: "input",
                name: "proxy",
                message: `What is the ${chalk.underline(
                    "URL"
                )} of the back-end server:`,
                when: answers => {
                    return answers.kind === "ssa";
                },
                default: "http://localhost:8080"
            }
        ])
            .then(answers => {
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
                            label = "Back-end server";
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
            })
            .then(answers => {
                if (!answers.proceed) return;
                this.props = Object.assign({}, this.props, answers);
            });
    }

    writing() {
        if (!this.props.proceed) return;

        this.fs.copyTpl(
            this.templatePath("webpack.config.js.tpl"),
            this.props.config,
            this.props
        );

        this.fs.copy(
            this.templatePath("assets/**/*"),
            this.destinationPath(this.props.input),
            {
                globOptions: {
                    dot: true
                }
            }
        );

        this.fs.write(
            this.destinationPath(`${this.props.output}/.gitkeep`),
            ""
        );
    }
};
