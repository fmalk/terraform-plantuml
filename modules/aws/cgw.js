import { attrSearch, nameSearch } from '../helpers.js';

/**
 * Find every Customer Gateway at this Region
 *
 * @param {any} state
 * @param {stack} stack
 * @param {string} region
 * @returns {string[]} List of CGW IDs at this Region
 */
export function loadCGW(state, stack, region) {
  const cgws = attrSearch(state, 'aws_customer_gateway', 'arn', (a) => a.indexOf(region) > 0);
  return cgws.map((cgw) => {
    stack.push({
      isGroup: false,
      title: `Customer Gateway\\n${nameSearch(cgw)}\\n${cgw.ip_address}`,
      reference: 'VPCCustomerGatewayIMG',
      id: cgw.id,
    });
    return cgw.id;
  });
}
