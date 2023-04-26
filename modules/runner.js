import chalk from 'chalk';
import { appendFileSync, readFileSync, unlinkSync } from 'fs';
import { satisfies } from 'semver';
import { loadAWS } from './aws/aws.js';
import { parse } from './parser.js';
import { fileURLToPath } from 'url';
import path from 'path';
import render from './render.js';

const TF_VERSION_CHECK = '>= 1.3.0';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function runner(input, output, options) {
  console.log(input);
  console.log(chalk.green('START'));
  const check = options.check;
  console.time(chalk.blue('READ ') + 'input file');
  let state;
  try {
    state = JSON.parse(readFileSync('./' + input));
    console.timeEnd(chalk.blue('READ ') + 'input file');
  } catch (e) {
    console.error(chalk.red('ERROR ') + 'reading input file: ', e.message);
    process.exit(9);
  }

  if (check) {
    console.log(chalk.blue('CHECK ') + 'terraform file version');
    if (!satisfies(state.terraform_version, TF_VERSION_CHECK)) {
      console.error(chalk.red('ERROR') + ` Terraform version must be ${TF_VERSION_CHECK}. Use the --no-check flag to override (and possible break parsing)`);
      process.exit(9);
    }
  } else {
    console.log(chalk.grey('SKIP CHECK ') + 'terraform file version');
  }
  try {
    // ignore errors
    unlinkSync(output);
  } catch (e) {}

  // Store as stack of blocks, init
  console.time(chalk.magenta('STACK') + ' TF resources');
  const stack = [];
  loadAWS(state, stack);
  console.timeEnd(chalk.magenta('STACK') + ' TF resources');

  // header
  console.time(chalk.magenta('WRITE') + ' parsed resources');
  const headerPath = path.resolve(__dirname + '/../templates/header.puml');
  appendFileSync(output, readFileSync(headerPath));

  // parser
  parse(stack);

  // footer
  const endPath = path.resolve(__dirname + '/../templates/end.puml');
  appendFileSync(output, readFileSync(endPath));
  console.timeEnd(chalk.magenta('WRITE') + ' parsed resources');

  // render image
  if (options.image) {
    await render(output);
    console.log(chalk.green('END text & image output'));
  } else {
    console.log(chalk.green('END text-only output'));
  }
}
