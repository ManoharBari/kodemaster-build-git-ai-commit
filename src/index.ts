#!/usr/bin/env bun

import { Command } from "commander";
import chalk from "chalk";
import { getStagedDiff } from "./git/diff";
import { parseDiff } from "./git/parser";

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
    const diff = await getStagedDiff();

    if (!diff.trim()) {
      console.error("No staged changes found. Did you forget to `git add`?");
      process.exit(1);
    }

    const files = parseDiff(diff);

    console.log(`Found ${files.length} changed file(s)`);
  });

program.parse(process.argv);
