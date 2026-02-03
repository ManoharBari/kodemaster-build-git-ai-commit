#!/usr/bin/env bun

import { Command } from "commander";
import chalk from "chalk";
import { validateConfig } from "./config";
import { getStagedDiff } from "./git/diff";
import { parseDiff, filterChanges } from "./git/parser";
import { generatePrompt } from "./utils/formatter";
import { generateCommitMessage } from "./ai/generator";

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

program
  .command("generate")
  .description("Generate a commit message from staged changes")
  .action(async () => {
    validateConfig();

    console.log(chalk.gray("Reading staged changes..."));
    const diff = await getStagedDiff();

    if (!diff.trim()) {
      console.error(
        chalk.red("No staged changes found. Did you forget to `git add`?"),
      );
      process.exit(1);
    }

    const parsed = parseDiff(diff);

    const files = filterChanges(parsed);

    if (files.length === 0) {
      console.warn(
        chalk.yellow(
          "All staged changes are in ignored files (e.g. lock files, .DS_Store).\n" +
            "Stage at least one meaningful file to generate a commit message.",
        ),
      );
      process.exit(1);
    }

    console.log(chalk.green(`Found ${files.length} changed file(s)`));

    const prompt = generatePrompt(files);

    console.log(chalk.gray("Generating commit message..."));
    const commitMessage = await generateCommitMessage(prompt);

    console.log("");
    console.log(chalk.green("─".repeat(40)));
    console.log(chalk.green("  Generated commit message:"));
    console.log(chalk.green("─".repeat(40)));
    console.log(chalk.bold(`  ${commitMessage}`));
    console.log(chalk.green("─".repeat(40)));
    console.log("");
    console.log(chalk.gray(`  Tip: git commit -m "${commitMessage}"`));
  });

program.parse(process.argv);
//comment