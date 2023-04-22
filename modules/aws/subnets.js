import { loadRDS } from './rds.js';
import { loadNAT } from './nat.js';
import { loadEC2 } from './ec2.js';
import { attrSearch, nameSearch } from '../helpers.js';

export function loadSubnets(state, stack, vpc_id) {
  const subnets = attrSearch(state, 'aws_subnet', 'vpc_id', vpc_id);
  const azs = subnets.map((i) => i.availability_zone);
  const unique_azs = Array.from(new Set(azs));

  unique_azs.forEach((az) => {
    // start AZ as a group with its subnets
    stack.push({
      isGroup: true,
      title: `AZ ${az}`,
      reference: 'AvailabilityZoneGroup',
      id: `${vpc_id}_${az}`,
    });
    subnets.forEach((s) => {
      if (s.availability_zone !== az) return;
      const is_public = searchIfPublicSubnet(state, s.id);
      const subnet_id = nameSearch(s);
      const subnetReference = {
        isGroup: true,
        title: `${is_public ? 'Pub' : 'Pvt'} Subnet ${subnet_id}\\n${s.cidr_block}`,
        reference: is_public ? 'PublicSubnetGroup' : 'PrivateSubnetGroup',
        id: subnet_id,
      };
      stack.push(subnetReference);
      // DATABASES
      const sg_record = state.resources.filter(
        (r) =>
          r.type === 'aws_db_subnet_group' && r.instances[0].attributes.subnet_ids.some((sgid) => sgid === subnet_id),
      );
      if (sg_record && sg_record.length > 0) {
        const subnet_group = sg_record[0].instances[0].attributes.name;
        loadRDS(state, stack, subnet_group, subnet_id, az);
      }
      // END DATABASES
      // NAT
      const hasPublicNAT = loadNAT(state, stack, subnet_id);
      if (hasPublicNAT) {
        // make sure it is a public subnet
        subnetReference.reference = 'PublicSubnetGroup';
        subnetReference.title = 'Pub' + subnetReference.title.substring(3);
      }
      // END NAT
      // EC2
      loadEC2(state, stack, subnet_id);
      stack.push({
        endGroup: true, // end subnet
      });
    });
    stack.push({
      endGroup: true, // end AZ
    });
  });
}

/**
 * A subnet can be considered public if it has a Public NAT Gateway or a Route Table connecting it to a IGW.
 * It could be a Route Table or a direct Route.
 */
function searchIfPublicSubnet(state, subnet_id) {
  const records = Array.from(
    new Set(
      state.resources
        .filter(
          (r) =>
            r.type === 'aws_route_table_association' && r.instances.some((i) => i.attributes.subnet_id === subnet_id),
        )
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
      const found = state.resources.filter(
        (r) => r.type === 'aws_internet_gateway' && r.instances[0].attributes.id === gid,
      );
      if (found.length > 0) return true;
    }
  }
  return false;
}
