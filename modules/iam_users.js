const { appendFileSync } = require('fs');
function graph(state) {
  const records = state.resources.filter((r) => r.type === 'aws_iam_user');
  if (records.length > 0) {
    appendFileSync(
      'output.puml',
      `
\tIAMGroup(iam) {`,
    );
    records.forEach((record, idx) => {
      appendFileSync(
        'output.puml',
        `
\t\trectangle "$UserIMG()\\n${record.instances[0].attributes.name}" as iam_user_${idx}`,
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
