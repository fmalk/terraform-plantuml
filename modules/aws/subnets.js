import { loadRDS } from './rds.js';
import { loadNAT } from './nat.js';
import { loadEC2 } from './ec2.js';
import { attrSearch, nameSearch } from '../helpers.js';
import { loadVPCLambdas } from './lambdas.js';

export function loadSubnets(state, stack, igws, vpc_id) {
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
      const is_public = searchIfPublicSubnet(state, igws, s.id);
      const subnet_name = nameSearch(s);
      const subnetReference = {
        isGroup: true,
        title: `${is_public ? 'Pub' : 'Pvt'} Subnet\\n${subnet_name}\\n${s.cidr_block}`,
        reference: is_public ? 'PublicSubnetGroup' : 'PrivateSubnetGroup',
        id: s.id,
      };
      stack.push(subnetReference);
      // arrows to IGW
      if (is_public) {
        igws.forEach((igw) => {
          stack.push({
            from: s.id,
            to: igw,
            arrow: '..[#1E890033]>',
          });
        });
      }
      // DATABASES
      const sg_record = state.resources.filter((r) => r.type === 'aws_db_subnet_group' && r.instances[0].attributes.subnet_ids.some((sgid) => sgid === s.id));
      if (sg_record && sg_record.length > 0) {
        const subnet_group = sg_record[0].instances[0].attributes.name;
        loadRDS(state, stack, subnet_group, s.id, az);
      }
      // END DATABASES
      // NAT
      loadNAT(state, stack, s.id);
      // END NAT
      // EC2
      loadEC2(state, stack, s.id);
      // VPC Lambdas
      loadVPCLambdas(state, stack, vpc_id, s.id);
      // END VPC Lambdas
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
function searchIfPublicSubnet(state, igws, subnet_id) {
  // route to IGW
  for (const igw of igws) {
    const routes = attrSearch(state, 'aws_route', 'gateway_id', igw);
    for (const route of routes) {
      const associations = attrSearch(state, 'aws_route_table_association', 'route_table_id', route.route_table_id);
      const foundPublicAssoc = associations.some((a) => a.subnet_id === subnet_id);
      if (foundPublicAssoc) return true;
    }
  }

  // FIXME: route table by searching route[]

  return false;
}
