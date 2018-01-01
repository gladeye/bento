#! /usr/bin/env nod
import * as yargs from "yargs";
import chalk from "chalk";

yargs.commandDir("commands", { extensions: ["js", "ts"] }).help().argv;
