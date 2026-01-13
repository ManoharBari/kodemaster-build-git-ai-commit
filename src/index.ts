#!/usr/bin/env bun

import { Command } from "commander";
import chalk from "chalk";
import { getStagedDiff } from "./git/diff";

const program = new Command();

program
  .name("git-ai-commit")
  .description("AI-powered commit message generator")
  .version("1.0.0");

program
  .command("hello")
  .description("Test command")
  .action(() => {
    console.log(chalk.green("Hello world"));
    console.log(chalk.gray("This is styled text"));
  });

// TODO: Uncomment the code below to pass the first stage
// program
//   .command('hello')
//   .description('Test command')
//   .action(() => {
//     console.log(chalk.green('Hello from git-ai-commit!'));
//   });

getStagedDiff();
program.parse(process.argv);
