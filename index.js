#! /usr/bin/env node

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { program } from 'commander';
import runner from './modules/runner.js';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packagePath = path.resolve(__dirname, './package.json');
const metadata = JSON.parse(readFileSync(packagePath));

program
  .name(chalk.blue(metadata.name))
  .description(chalk.magenta(metadata.description))
  .version(metadata.version, '-v, --version', 'current version of tfpuml')
  .argument('[input]', 'TF state file', 'terraform.tfstate')
  .argument('[output]', 'PlantUML output file', 'output.puml')
  .option('-n, --no-check', chalk.red('do not check') + ' for terraform version')
  .option(
    '-i, --image',
    chalk.blue('render') +
      ' a PNG image after creating the output.puml file. ' +
      chalk.red('Requires') +
      ' "tfpuml-download-plantuml" to be run first, or .',
  )
  .action(async (input, output, options) => await runner(input, output, options))
  .addHelpText(
    'after',
    `
Download PlantUML Java executable:
  $> tfpuml-download-plantuml`,
  );

program.parse(process.argv);
