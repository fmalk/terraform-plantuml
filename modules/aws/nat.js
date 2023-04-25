import { attrSearch, nameSearch } from '../helpers.js';
import { loadEIP } from './eip.js';

/**
 * Find every NAT at this Subnet
 *
 * @param {any} state
 * @param {any} stack
 * @param {string} subnet_id
 * @returns {boolean} True if a Public NAT was found, false otherwise.
 */
export function loadNAT(state, stack, subnet_id) {
  const nats = attrSearch(state, 'aws_nat_gateway', 'subnet_id', subnet_id);
  if (nats.length === 0) return false;

  let publicNAT = false;
  nats.forEach((nat) => {
    // public NAT can be usually detected by IGW routes, but
    // a NAT with this property as "public" most likely will have a route
    // pointing to an IGW
    if (nat.connectivity_type === 'public') publicNAT = true;

    let title = nameSearch(nat);
    if (nat.private_ip) title += `\\n${nat.private_ip}`;
    if (nat.public_ip) title += `\\n${nat.public_ip}`;
    else {
      const eip = loadEIP(state, nat.allocation_id);
      if (eip.length > 0) title += `\\nEIP ${eip[0].public_ip}`;
    }
    stack.push({
      isGroup: false,
      title: `NAT Gateway\\n${title}`,
      reference: 'VPCNATGatewayIMG',
      id: nat.id,
    });

    // find routes pointing to this NAT
    const routes = attrSearch(state, 'aws_route', 'nat_gateway_id', nat.id);
    // find route tables pointing to this NAT
    const routeTables = attrSearch(state, 'aws_route_table', 'route', (r) => r.nat_gateway_id === nat.id);

    const bothRoutes = routes.concat(routeTables);
    bothRoutes.forEach((table) => {
      // find subnets associations pointing to this route table
      const associations = attrSearch(state, 'aws_route_table_association', 'route_table_id', table.route_table_id);
      associations.forEach((a) => {
        stack.push({
          from: a.subnet_id,
          to: nat.id,
          arrow: '..[#5B9CD5]>',
        });
      });
    });
  });
  return publicNAT;
}
