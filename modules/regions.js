import { appendFileSync } from 'fs';

export function graphRegions(state) {
  const records = state.resources.map((r) => {
    if (r.instances && r.instances[0] && !!r.instances[0].attributes.arn) {
      const arn_match = r.instances[0].attributes.arn.match(/(\S{2}-\S{3,16}:)/);
      return arn_match ? arn_match[0].substr(0, arn_match[0].length - 1) : null;
    } else return null;
  });
  const unique = Array.from(new Set(records.filter((r) => !!r)));
  if (unique.length > 0) {
    unique.forEach((region, idx) => {
      appendFileSync(
        'output.puml',
        `
\tRegionGroup(region_${idx}, "${region}") {
\t
`,
      );
    });
  }
}
