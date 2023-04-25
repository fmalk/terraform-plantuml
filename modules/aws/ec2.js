import { attrSearch, nameSearch } from '../helpers.js';
import { loadEIP } from './eip.js';

export function loadEC2(state, stack, subnet_id) {
  const records = attrSearch(state, 'aws_instance', 'subnet_id', subnet_id);
  const spots = attrSearch(state, 'aws_spot_instance_request', 'subnet_id', subnet_id);
  const instances = records.concat(spots);
  instances.forEach((atts) => {
    const isSpot = !!atts.spot_type;
    const family = atts.instance_type.substr(0, atts.instance_type.indexOf('.')).toUpperCase();
    const reference = `EC2${isSpot ? 'Spot' : family}InstanceIMG`;
    let title = isSpot ? 'Spot ' : '';
    title += nameSearch(atts);
    let ips = '';
    if (atts.private_ip) ips += `\\n${atts.private_ip}`;
    if (atts.public_ip) ips += `\\n${atts.public_ip}`;
    stack.push({
      isGroup: false,
      title: `${title}\\n${atts.instance_type}${ips}`,
      reference,
      id: atts.id,
    });
  });
}
