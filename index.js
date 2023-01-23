import { satisfies } from 'semver';
import chalk from 'chalk';
import { appendFileSync, readFileSync, unlinkSync } from 'fs';
import { Command } from 'commander';
import { loadAWS } from './modules/aws.js';
import { parse } from './parser.js';

const TF_VERSION_CHECK = '>= 1.3.0';

const metadata = JSON.parse(readFileSync('package.json'));
const program = new Command();

program
  .name(metadata.name)
  .description(metadata.description)
  .version(metadata.version)
  // .command('group')
  // .argument('<input>', 'TF state file', 'terraform.tfstate')
  .option('-n, --no-check', 'Do not check for TF version');
// .action((input, opts) => {
//
// });

program.parse();

console.log(chalk.green('START'));

const options = program.opts();
const no_check = options.check;
console.time(chalk.blue('READ ') + 'terraform.state' + ' file');
let state;
try {
  state = JSON.parse(readFileSync('terraform.tfstate'));
  console.timeEnd(chalk.blue('READ ') + 'terraform.state' + ' file');
} catch (e) {
  console.error(chalk.red('ERROR ') + 'reading input file: ', e.message);
  process.exit(9);
}

if (!no_check && !satisfies(state.terraform_version, TF_VERSION_CHECK)) {
  console.error(chalk.red('ERROR') + ` Terraform version must be ${TF_VERSION_CHECK}. Use the --no-check flag to override (and possible break parsing)`);
  process.exit(9);
}
try {
  // ignore errors
  unlinkSync('output.puml');
} catch (e) {}

// Store as stack of blocks, init
console.time(chalk.magenta('STACK') + ' TF resources');
const stack = [];
loadAWS(state, stack);
console.timeEnd(chalk.magenta('STACK') + ' TF resources');

// header
console.time(chalk.blue('WRITE') + ' header');
appendFileSync('output.puml', readFileSync('templates/header.puml'));
console.timeEnd(chalk.blue('WRITE') + ' header');

// parser
console.time(chalk.magenta('WRITE') + ' parsed resources');
parse(stack);
console.timeEnd(chalk.magenta('WRITE') + ' parsed resources');

// footer
console.time(chalk.blue('WRITE') + ' footer');
appendFileSync('output.puml', readFileSync('templates/end.puml'));
console.timeEnd(chalk.blue('WRITE') + ' footer');

console.log(chalk.green('END'));
