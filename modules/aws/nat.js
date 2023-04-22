import { attrSearch, nameSearch } from '../helpers.js';
import { loadEIP } from './eip.js';

export function loadNAT(state, stack, subnet_id) {
  const nats = attrSearch(state, 'aws_nat_gateway', 'subnet_id', subnet_id);
  if (nats.length === 0) return false;

  let publicNAT = false;
  nats.forEach((nat) => {
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
      title,
      reference: 'VPCNATGatewayIMG',
      id: nat.id,
    });

    // find route tables pointing to this NAT
    const routeTables = attrSearch(state, 'aws_route_table', 'route', (r) => r.nat_gateway_id === nat.id);
    routeTables.forEach((table) => {
      // find subnets associations pointing to this route table
      const associations = attrSearch(state, 'aws_route_table_association', 'route_table_id', table.id);
      associations.forEach((a) => {
        stack.push({
          from: a.subnet_id,
          to: nat.id,
          arrow: '..>',
        });
      });
    });
  });
  return publicNAT;

  /*const records = state.resources.filter((r) => r.type === 'aws_nat_gateway');
  records.forEach((nat, idx) => {
    nat.instances.forEach((instance) => {
      if (instance.attributes.subnet_id === subnet_id) {
        // Create arrows connecting this NAT
        const route_tables_ids = state.resources
          .filter((r) => r.type === 'aws_route_table')
          .map((r) => r.instances)
          .flat()
          .map((a) => a.attributes)
          .filter((a) => a.route.some((r) => r.nat_gateway_id === atts.id));
        route_tables_ids.forEach((id) => {
          const associations = state.resources
            .filter((r) => r.type === 'aws_route_table_association' && r.instances[0].attributes.route_table_id === id)
            .map((a) => a.instances.map((i) => i.attributes.subnet_id))
            .flat();
          associations.forEach((a) => {
            stack.push({
              from: a,
              to: atts.id,
              arrow: '..>',
            });
          });
        });
      }
    });
  });*/
}
