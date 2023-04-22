import { loadIamUsers } from './iam_users.js';
import { loadBucket } from './buckets.js';
import { loadRegions } from './regions.js';

export function loadAWS(state, stack) {
  stack.push({
    isGroup: true,
    title: 'AWS',
    reference: 'AWSCloudGroup',
    id: 'aws',
  });
  loadIamUsers(state, stack);
  loadBucket(state, stack);
  loadRegions(state, stack);
  stack.push({
    endGroup: true,
  });
}
