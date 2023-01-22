const { appendFileSync } = require('fs');
function graph(state) {
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
\t}`,
    );
  }
}
module.exports = { graph };
