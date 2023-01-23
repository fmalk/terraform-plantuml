export function loadIGW(state, stack, vpc_id) {
  const records = state.resources.filter((r) => r.type === 'aws_internet_gateway' && r.instances[0].attributes.vpc_id === vpc_id);
  records.forEach((r, idx) => {
    stack.push({
      isGroup: false,
      title: r.instances[0].attributes.tags.Name || r.instances[0].attributes.id,
      reference: 'VPCInternetGatewayIMG',
      id: r.instances[0].attributes.id,
    });
  });
}
