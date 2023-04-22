import { attrSearch, nameSearch } from '../helpers.js';

export function loadIGW(state, stack, vpc_id) {
  const igws = attrSearch(state, 'aws_internet_gateway', 'vpc_id', vpc_id);
  igws.forEach((igw) => {
    stack.push({
      isGroup: false,
      title: nameSearch(igw),
      reference: 'VPCInternetGatewayIMG',
      id: igw.id,
    });
  });
}
