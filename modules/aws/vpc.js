import { loadIGW } from './igw.js';
import { loadSubnets } from './subnets.js';
import { loadVPNGW } from './vpn_gw.js';
import { attrSearch, nameSearch } from '../helpers.js';

/**
 * Find every VPC at this Region
 *
 * @param {any} state
 * @param {any} stack
 * @param {string} region
 * @returns {string[]}
 */
export function loadVPC(state, stack, region) {
  const records = attrSearch(state, 'aws_vpc', 'arn', (a) => a.indexOf(region) > 0);
  return records.map((vpc) => {
    let title = nameSearch(vpc);
    stack.push({
      isGroup: true,
      title: `VPC ${title}`,
      reference: 'VPCGroup',
      id: vpc.id,
    });
    loadVPNGW(state, stack, vpc.id);
    const igws = loadIGW(state, stack, vpc.id);
    loadSubnets(state, stack, igws, vpc.id);
    stack.push({
      endGroup: true,
    });
    return vpc.id;
  });
}
