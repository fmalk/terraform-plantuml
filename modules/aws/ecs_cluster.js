import { attrSearch, nameSearch, sanitizeID } from '../helpers.js';

export function loadCluster(state, stack, region) {
  const clusters = attrSearch(state, 'aws_ecs_cluster', 'arn', (a) => a.indexOf(region) > 0);
  clusters.forEach((cluster) => {
    let title = nameSearch(cluster);
    stack.push({
      isGroup: false,
      title,
      reference: 'ElasticContainerServiceIMG',
      id: sanitizeID(cluster.id),
    });
  });
}
