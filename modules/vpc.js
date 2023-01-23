import { loadIGW } from './igw.js';
import { loadSubnets } from './subnets.js';

export function loadVPC(state, stack, region) {
  const records = state.resources.filter((r) => r.type === 'aws_vpc' && r.instances[0].attributes.arn.indexOf(region) > 0);
  records.forEach((r, idx) => {
    stack.push({
      isGroup: true,
      title: `VPC ${r.instances[0].attributes.tags.Name || r.instances[0].attributes.id}`,
      reference: 'VPCGroup',
      id: r.instances[0].attributes.id,
    });
    loadIGW(state, stack, r.instances[0].attributes.id);
    loadSubnets(state, stack, r.instances[0].attributes.id);
    stack.push({
      endGroup: true,
    });
  });
}
