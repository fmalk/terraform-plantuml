const { Command } = require('commander');
const { satisfies } = require('semver');
const { readFileSync, appendFileSync, unlinkSync } = require('fs');
const { graph: graphIamUsers } = require('./modules/iam_users');
const { graph: graphBuckets } = require('./modules/buckets');
const { graph: graphVPC } = require('./modules/vpc');

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

const options = program.opts();
const no_check = options.check;
const state = JSON.parse(readFileSync('terraform.tfstate'));

if (!no_check && !satisfies(state.terraform_version, TF_VERSION_CHECK))
  program.error(`Terraform version must be ${TF_VERSION_CHECK}. Use the --no-check flag to override (and possible break parsing)`);

try {
  // ignore errors
  unlinkSync('output.puml');
} catch (e) {}

// header
appendFileSync('output.puml', readFileSync('templates/header.puml'));

graphIamUsers(state);
graphBuckets(state);
graphVPC(state);

// footer
appendFileSync('output.puml', readFileSync('templates/end.puml'));
