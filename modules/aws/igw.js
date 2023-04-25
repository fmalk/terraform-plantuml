import { attrSearch, nameSearch } from '../helpers.js';

/**
 * Find every IGW at this VPC
 *
 * @param {any} state
 * @param {stack} stack
 * @param {string} vpc_id
 * @returns {string[]} List of IGW IDs at this VPC
 */
export function loadIGW(state, stack, vpc_id) {
  const igws = attrSearch(state, 'aws_internet_gateway', 'vpc_id', vpc_id);
  return igws.map((igw) => {
    stack.push({
      isGroup: false,
      title: `Internet Gateway\\n${nameSearch(igw)}`,
      reference: 'VPCInternetGatewayIMG',
      id: igw.id,
    });
    return igw.id;
  });
}
