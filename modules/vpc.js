import { appendFileSync } from 'fs';

export function graphVPCs(state) {
  const records = state.resources.filter((r) => r.type === 'aws_vpc');
  if (records.length > 0) {
    records.forEach((record, idx) => {
      appendFileSync(
        'output.puml',
        `
\t\tVPCGroup(vpc_${idx}, "VPC ${record.instances[0].attributes.tags.Name}") {
\t\t\trectangle "$VPCInternetGatewayIMG()\\nteste${idx}" as igw_${idx}
\t\t}
`,
      );
    });
    appendFileSync(
      'output.puml',
      `
\t\tregion_0 -[hidden]u-> s3
\t}`,
    );
  }
}
