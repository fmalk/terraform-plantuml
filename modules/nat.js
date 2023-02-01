export function loadNAT(state, stack, subnet_id) {
  const records = state.resources.filter(
    (r) => r.type === 'aws_nat_gateway' && r.instances[0].attributes.subnet_id === subnet_id,
  );
  records.forEach((nat, idx) => {
    const atts = nat.instances[0].attributes;
    let title = atts.id;
    if (atts.tags && atts.tags.Name) title = atts.tags.Name;
    stack.push({
      isGroup: false,
      title: `${title}\\n${atts.private_ip}\\n${atts.public_ip}`,
      reference: 'VPCNATGatewayIMG',
      id: atts.id,
    });

    // Create arrows connecting this NAT
    const route_tables_ids = state.resources
      .filter(
        (r) =>
          r.type === 'aws_route_table' && r.instances[0].attributes.route.some((t) => t.nat_gateway_id === atts.id),
      )
      .map((r) => r.instances[0].attributes.id);
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
  });
}
