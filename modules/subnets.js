import { loadRDS } from './rds.js';

export function loadSubnets(state, stack, vpc_id) {
  const records = state.resources.filter((r) => r.type === 'aws_subnet' && r.instances[0].attributes.vpc_id === vpc_id);
  const azs = records.map((r) => r.instances.map((i) => i.attributes.availability_zone)).flat();
  const unique_azs = Array.from(new Set(azs.filter((r) => !!r)));

  unique_azs.forEach((az) => {
    stack.push({
      isGroup: true,
      title: `AZ ${az}`,
      reference: 'AvailabilityZoneGroup',
      id: `${vpc_id}_${az}`,
    });
    records.forEach((r, idx) => {
      r.instances.forEach((s) => {
        if (s.attributes.availability_zone === az) {
          stack.push({
            isGroup: true,
            title: `Subnet ${s.attributes.tags.Name || s.attributes.id}\\n${s.attributes.cidr_block}`,
            reference: s.attributes.map_public_ip_on_launch ? 'PublicSubnetGroup' : 'PrivateSubnetGroup',
            id: s.attributes.id,
          });
          const sg_record = state.resources.filter(
            (r) => r.type === 'aws_db_subnet_group' && r.instances[0].attributes.subnet_ids.some((sgid) => sgid === s.attributes.id),
          );
          if (sg_record) {
            const subnet_group = sg_record[0].instances[0].attributes.name;
            loadRDS(state, stack, subnet_group, s.attributes.id);
          }
          stack.push({
            endGroup: true,
          });
        } // end az
      });
    });
    stack.push({
      endGroup: true,
    });
  });
}
