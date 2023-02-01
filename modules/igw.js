export function loadIGW(state, stack, vpc_id) {
  const records = state.resources.filter(
    (r) => r.type === 'aws_internet_gateway' && r.instances[0].attributes.vpc_id === vpc_id,
  );
  records.forEach((r, idx) => {
    const atts = r.instances[0].attributes;
    let title = atts.id;
    if (atts.tags && atts.tags.Name) title = atts.tags.Name;
    stack.push({
      isGroup: false,
      title,
      reference: 'VPCInternetGatewayIMG',
      id: r.instances[0].attributes.id,
    });
  });
}
