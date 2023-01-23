import { loadIamUsers } from './iam_users.js';
import { loadBuckets } from './buckets.js';
import { loadRegions } from './regions.js';

export function loadAWS(state, stack) {
  stack.push({
    isGroup: true,
    title: 'AWS',
    reference: 'AWSCloudGroup',
    id: 'aws',
  });
  loadIamUsers(state, stack);
  loadBuckets(state, stack);
  loadRegions(state, stack);
  stack.push({
    endGroup: true,
  });
}
