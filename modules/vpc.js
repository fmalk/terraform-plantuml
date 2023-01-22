const { appendFileSync } = require('fs');
function graph(state) {
  const records = state.resources.filter((r) => r.type === 'aws_vpc');
  if (records.length > 0) {
    appendFileSync(
      'output.puml',
      `
\tRegionGroup(region) {
`,
    );
    records.forEach((record, idx) => {
      appendFileSync(
        'output.puml',
        `
\t\tVPCGroup(vpc, "VPC ${record.instances[0].attributes.tags.Name}") {
\t\t\tVPCInternetGateway(internet_gateway, "IGW", "")
\t\t}
`,
      );
    });
    appendFileSync(
      'output.puml',
      `
\t}`,
    );
  }
}
module.exports = { graph };
