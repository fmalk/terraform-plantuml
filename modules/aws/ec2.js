export function loadEC2(state, stack, subnet_id) {
  const records = state.resources
    .filter((r) => r.type === 'aws_instance')
    .map((e) => e.instances)
    .flat()
    .map((a) => a.attributes)
    .filter((s) => s.subnet_id === subnet_id);
  records.forEach((atts) => {
    const family = atts.instance_type.substr(0, atts.instance_type.indexOf('.')).toUpperCase();
    const reference = `EC2${family}InstanceIMG`;
    let title = s.id;
    if (atts.tags && atts.tags.Name) title = atts.tags.Name;
    stack.push({
      isGroup: false,
      title: `${title}\\n${atts.instance_type}\\n${atts.private_ip}\\n${atts.public_ip}`,
      reference,
      id: atts.id,
    });
  });
}
