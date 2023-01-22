import { appendFileSync } from 'fs';

export function graphBuckets(state) {
  const records = state.resources.filter((r) => r.type === 'aws_s3_bucket');
  if (records.length > 0) {
    appendFileSync(
      'output.puml',
      `
\tS3BucketGroup(s3) {`,
    );
    records.forEach((record, idx) => {
      appendFileSync(
        'output.puml',
        `
\t\trectangle "$SimpleStorageServiceBucketIMG()\\n${record.instances[0].attributes.bucket}" as s3_${idx}`,
      );
    });
    appendFileSync(
      'output.puml',
      `
\t\ts3 -[hidden]u-> iam
\t}`,
    );
  }
}
