import { loadRDS } from './rds.js';
import { loadNAT } from './nat.js';
import { loadEC2 } from './ec2.js';

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
          const is_public = searchIfPublicSubnet(state, s.attributes.id);
          const subnet_id = s.attributes.id;
          stack.push({
            isGroup: true,
            title: `Subnet ${s.attributes.tags.Name || subnet_id}\\n${s.attributes.cidr_block}`,
            reference: is_public ? 'PublicSubnetGroup' : 'PrivateSubnetGroup',
            id: subnet_id,
          });
          // DATABASES
          const sg_record = state.resources.filter(
            (r) => r.type === 'aws_db_subnet_group' && r.instances[0].attributes.subnet_ids.some((sgid) => sgid === subnet_id),
          );
          if (sg_record && sg_record.length > 0) {
            const subnet_group = sg_record[0].instances[0].attributes.name;
            loadRDS(state, stack, subnet_group, subnet_id, az);
          }
          // END DATABASES
          // NAT
          loadNAT(state, stack, subnet_id);
          // END NAT
          // EC2
          loadEC2(state, stack, subnet_id);
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

/**
 * A subnet can only be considered public if it has a Route Table connecting it to a IGW.
 */
function searchIfPublicSubnet(state, subnet_id) {
  const records = Array.from(
    new Set(
      state.resources
        .filter((r) => r.type === 'aws_route_table_association' && r.instances.some((i) => i.attributes.subnet_id === subnet_id))
        .map((r) => r.instances.map((i) => i.attributes.route_table_id))
        .flat(),
    ),
  );
  for (const tid of records) {
    // has every gateway id associated with this subnet
    const igw = state.resources
      .filter((r) => r.type === 'aws_route_table' && r.instances[0].attributes.id === tid)
      .map((r) => r.instances[0].attributes.route[0].gateway_id)
      .filter((id) => !!id);
    for (const gid of igw) {
      // if indeed there is an IGW with this id, this is a public subnet
      const found = state.resources.filter((r) => r.type === 'aws_internet_gateway' && r.instances[0].attributes.id === gid);
      if (found.length > 0) return true;
    }
  }
  return false;
}
