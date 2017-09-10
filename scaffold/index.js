const Generator = require("yeoman-generator"),
    chalk = require("chalk"),
    { select, inside, trailing } = require("./utils");

const presets = {
    spa: {
        config: "./webpack.config.js",
        input: "./app/",
        output: "./public/",
        public: "/"
    },

    ssa: {
        config: "./webpack.config.js",
        input: "./assets/",
        output: "./public/assets/",
        public: "/assets/",
        proxy: "http://localhost:8080"
    }
};

const def = function(key) {
    return select(key, presets);
};

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        // This method adds support for a `--coffee` flag
        this.option("default", { type: String });
    }

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
        let prompt;

        if (this.options.default && presets[this.options.default]) {
            prompt = Promise.resolve(
                Object.assign({}, presets[this.options.default], {
                    kind: this.options.default
                })
            );
        } else {
            prompt = this.prompt([
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
                    default: def("config"),
                    validate: inside("Config file", this.destinationRoot())
                },

                {
                    type: "input",
                    name: "input",
                    message: `Where should the ${chalk.underline(
                        "input folder"
                    )} be:`,
                    default: def("input"),
                    validate: inside("Input folder", this.destinationRoot()),
                    filter: trailing("/")
                },

                {
                    type: "input",
                    name: "output",
                    message: `Where should the ${chalk.underline(
                        "output folder"
                    )} be:`,
                    default: def("output"),
                    validate: inside("Output folder", this.destinationRoot()),
                    filter: trailing("/")
                },

                {
                    type: "input",
                    name: "public",
                    message: `What should the ${chalk.underline(
                        "public path"
                    )} be:`,
                    default: def("public"),
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
                    default: def("proxy")
                }
            ]);
        }

        return prompt
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
            this.templatePath("webpack.config.js"),
            this.destinationPath(this.props.config),
            this.props
        );

        this.fs.copyTpl(
            this.templatePath("assets/**/*"),
            this.destinationPath(this.props.input),
            this.props,
            {},
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
        if (!this.props.proceed) {
            if (this.options.default) {
                this.log("");

                this.log(
                    "Not happy with the default? Feel free to run in interactive mode."
                );
                this.log(
                    chalk.green.bold(
                        "yo ./node_modules/@gladeye/bento/scaffold"
                    )
                );
            }
            return;
        }

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
