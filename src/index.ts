#!/usr/bin/env bun

import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('git-ai-commit')
  .description('AI-powered commit message generator')
  .version('1.0.0');

// TODO: Uncomment the code below to pass the first stage
// program
//   .command('hello')
//   .description('Test command')
//   .action(() => {
//     console.log(chalk.green('Hello from git-ai-commit!'));
//   });

program.parse(process.argv);
