#!/usr/bin/env bun

import { Command } from "commander";
import chalk from "chalk";
import { validateConfig } from "./config";
import { getStagedDiff } from "./git/diff";
import { parseDiff, filterChanges } from "./git/parser";
import { generatePrompt } from "./utils/formatter";
import { generateCommitMessage } from "./ai/generator";

// ─── CLI setup ───────────────────────────────────────────────────────────────

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

// ─── Generate command ────────────────────────────────────────────────────────

program
  .command("generate")
  .description("Generate a commit message from staged changes")
  .action(async () => {
    // ── 1. Validate config (only here, not at import time) ───────────────────
    validateConfig();

    // ── 2. Read git ──────────────────────────────────────────────────────────
    console.log(chalk.gray("Reading staged changes..."));
    const diff = await getStagedDiff();

    // ── 3. Guard: nothing staged ─────────────────────────────────────────────
    if (!diff.trim()) {
      console.error(
        chalk.red("No staged changes found. Did you forget to `git add`?"),
      );
      process.exit(1);
    }

    // ── 4. Parse ─────────────────────────────────────────────────────────────
    const parsed = parseDiff(diff);

    // ── 5. Filter noise ──────────────────────────────────────────────────────
    const files = filterChanges(parsed);

    // ── 6. Guard: only noise was staged ──────────────────────────────────────
    if (files.length === 0) {
      console.warn(
        chalk.yellow(
          "All staged changes are in ignored files (e.g. lock files, .DS_Store).\n" +
            "Stage at least one meaningful file to generate a commit message.",
        ),
      );
      process.exit(1);
    }

    console.log(chalk.green(`  ✓ Found ${files.length} changed file(s)`));

    // ── 7. Format the briefing ───────────────────────────────────────────────
    const prompt = generatePrompt(files);

    // ── 8. Send to AI ────────────────────────────────────────────────────────
    console.log(chalk.gray("Generating commit message..."));
    const commitMessage = await generateCommitMessage(prompt);

    // ── 9. Output ────────────────────────────────────────────────────────────
    console.log("");
    console.log(chalk.green("─".repeat(40)));
    console.log(chalk.green("  Generated commit message:"));
    console.log(chalk.green("─".repeat(40)));
    console.log(chalk.bold(`  ${commitMessage}`));
    console.log(chalk.green("─".repeat(40)));
    console.log("");
    console.log(chalk.gray(`  Tip: git commit -m "${commitMessage}"`));
  });

// ─── Run ─────────────────────────────────────────────────────────────────────

program.parse(process.argv);
