import { satisfies } from 'semver';
import chalk from 'chalk';
import { appendFileSync, readFileSync, unlinkSync } from 'fs';
import { loadAWS } from './modules/aws.js';
import { loadIamUsers } from './modules/iam_users.js';
import { loadBuckets } from './modules/buckets.js';
import { loadRegions } from './modules/regions.js';
import { Command } from 'commander';

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
console.log(chalk.blue('READING ') + 'terraform.state' + ' file');
let state;
try {
  state = JSON.parse(readFileSync('terraform.tfstate'));
  console.log(chalk.blue('PARSE') + ' sucessful');
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
console.log(chalk.green('START') + ' stacking');
const stack = [];
loadAWS(state, stack);
loadIamUsers(state, stack);
loadBuckets(state, stack);
loadRegions(state, stack);
console.log(stack);
console.log(chalk.green('END') + ' stacking');

// header
console.log(chalk.blue('WRITE') + ' header');
appendFileSync('output.puml', readFileSync('templates/header.puml'));

// footer
console.log(chalk.blue('WRITE') + ' footer');
appendFileSync('output.puml', readFileSync('templates/end.puml'));

console.log(chalk.green('END'));
