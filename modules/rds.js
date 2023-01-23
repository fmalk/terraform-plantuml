export function loadRDS(state, stack, subnet_group, subnet_id) {
  const records = state.resources.filter((r) => r.type === 'aws_db_instance' && r.instances[0].attributes.db_subnet_group_name === subnet_group);

  records.forEach((r, idx) => {
    const att = r.instances[0].attributes;
    stack.push({
      isGroup: false,
      title: `${att.id}\\n${att.engine}:${att.engine_version_actual}\\n${att.instance_class}`,
      reference: att.multi_az ? 'RDSMultiAZIMG' : 'AuroraAmazonRDSInstanceIMG',
      id: `${subnet_id}_${r.instances[0].attributes.id}`,
    });
  });
}
