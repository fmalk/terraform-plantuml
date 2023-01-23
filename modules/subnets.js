export function loadSubnets(state, stack, vpc_id) {
  const records = state.resources.filter((r) => r.type === 'aws_subnet' && r.instances[0].attributes.vpc_id === vpc_id);
  records.forEach((r, idx) => {
    stack.push({
      isGroup: true,
      title: `Subnet ${r.instances[0].attributes.tags.Name || r.instances[0].attributes.id}\\n${r.instances[0].attributes.cidr_block}`,
      reference: r.instances[0].attributes.map_public_ip_on_launch ? 'PublicSubnetGroup' : 'PrivateSubnetGroup',
      id: r.instances[0].attributes.id,
    });
    stack.push({
      endGroup: true,
    });
  });
}
