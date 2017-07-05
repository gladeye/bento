const Generator = require("yeoman-generator"),
    chalk = require("chalk"),
    { select, inside, trailing } = require("./utils");

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

module.exports = class extends Generator {
    initializing() {
        this.props = {};

        this.log(
            chalk.gray(
                `! Project folder: ${chalk.bold.white(this.destinationRoot())}`
            )
        );

        this.log(chalk.gray("---"));
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
                default: "./webpack.config.js",
                validate: inside("Config file", this.destinationRoot())
            },

            {
                type: "input",
                name: "input",
                message: `Where should the ${chalk.underline(
                    "input folder"
                )} be:`,
                default: select("input", presets),
                validate: inside("Input folder", this.destinationRoot()),
                filter: trailing("/")
            },

            {
                type: "input",
                name: "output",
                message: `Where should the ${chalk.underline(
                    "output folder"
                )} be:`,
                default: select("output", presets),
                validate: inside("Output folder", this.destinationRoot()),
                filter: trailing("/")
            },

            {
                type: "input",
                name: "public",
                message: `What should the ${chalk.underline(
                    "public path"
                )} be:`,
                default: select("public", presets),
                filter: trailing("/")
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
                this.log(chalk.gray("---"));

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
                            val = `${chalk.gray("<URL>")}${value}`;
                            break;
                        case "proxy":
                            label = "Back-end server";
                            break;
                    }

                    if (label) {
                        this.log(
                            chalk.gray(`> ${label}: ${chalk.bold.white(val)}`)
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

        if (this.props.kind === "spa") {
            this.fs.copy(
                this.templatePath("index.ejs"),
                this.destinationPath(`${this.props.input}/index.ejs`)
            );
        }
    }

    end() {
        if (!this.props.proceed) return;

        this.log("");

        this.log("Scaffolding complete ✨");

        this.log("");

        this.log(
            `One last thing, update ${chalk.bold(
                "package.json"
            )} with the following settings:`
        );

        this.log(chalk.gray("..."));
        this.log('"scripts": {');
        this.log(
            `  ${chalk.bold.green('"start:webpack"')}: ${chalk.green(
                `"webpack-dev-server --config ${this.props.config}",`
            )}`
        );
        this.log(
            `  ${chalk.bold.green('"build:webpack"')}: ${chalk.green(
                `"NODE_ENV=production webpack --config ${this.props.config}"`
            )}`
        );
        this.log("}");
        this.log(chalk.gray("..."));
    }
};
