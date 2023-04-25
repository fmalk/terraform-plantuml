import { attrSearch, nameSearch } from '../helpers.js';

/**
 * Find every VPN Gateway at this VPC
 *
 * @param {any} state
 * @param {stack} stack
 * @param {string} vpc_id
 * @returns {string[]} List of VPNGW IDs at this VPC
 */
export function loadVPNGW(state, stack, vpc_id) {
  const vpngws = attrSearch(state, 'aws_vpn_gateway', 'vpc_id', vpc_id);
  return vpngws.map((vpn) => {
    stack.push({
      isGroup: false,
      title: `VPN Gateway\\n${nameSearch(vpn)}`,
      reference: 'VPCVPNGatewayIMG',
      id: vpn.id,
    });
    return vpn.id;
  });
}
