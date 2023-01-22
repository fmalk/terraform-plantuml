import { appendFileSync } from 'fs';

export function loadAWS(state, tree) {
  if (!tree) tree = {};
  tree.cloud = {
    id: 'aws',
    iam: {},
    s3: {},
    regions: [],
  };
}

export function graphAWS(object) {
  appendFileSync(
    'output.puml',
    `
AWSCloudGroup(aws) {`,
  );
}
