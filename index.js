const {program} = require("commander");
const {readFileSync, appendFileSync } = require("fs");

const metadata = JSON.parse(readFileSync('package.json'));

program
  .name(metadata.name)
  .description(metadata.description)
  .version(metadata.version);

program
  .option('-i, --input <file>')

program.parse();

appendFileSync('output.puml', readFileSync('templates/header.puml'));
