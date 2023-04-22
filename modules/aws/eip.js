import { attrSearch } from '../helpers.js';

export function loadEIP(state, allocation_id) {
  return attrSearch(state, 'aws_eip', 'allocation_id', allocation_id);
}
