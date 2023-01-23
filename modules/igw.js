export function loadIGWs(state, stack, vpc_id) {
  console.log(vpc_id);
  const records = state.resources.filter((r) => r.type === 'aws_internet_gateway' && r.instances[0].attributes.vpc_id === vpc_id);
  if (records.length > 0) {
    records.forEach((r, idx) => {
      stack.push({
        isGroup: false,
        title: r.instances[0].attributes.tags.Name || r.instances[0].attributes.id,
        reference: '$VPCInternetGatewayIMG()',
        id: `${vpc_id}_igw_${idx}`,
      });
    });
  }
}
