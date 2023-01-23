import { loadIGWs } from './igw.js';

export function loadVPCs(state, stack, region) {
  const records = state.resources.filter((r) => r.type === 'aws_vpc' && r.instances[0].attributes.arn.indexOf(region) > 0);
  records.forEach((r, idx) => {
    stack.push({
      isGroup: true,
      title: `VPC ${r.instances[0].attributes.tags.Name || r.instances[0].attributes.id}`,
      reference: 'VPCGroup',
      id: `${region}_vpc_${idx}`,
    });
    loadIGWs(state, stack, r.instances[0].attributes.id);
  });
}
