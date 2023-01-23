import { loadVPC } from './vpc.js';

export function loadRegions(state, stack) {
  const records = state.resources.map((r) => {
    if (r.instances && r.instances[0] && !!r.instances[0].attributes.arn) {
      const arn_match = r.instances[0].attributes.arn.match(/(\S{2}-\S{3,16}:)/);
      return arn_match ? arn_match[0].substr(0, arn_match[0].length - 1) : null;
    } else return null;
  });
  const unique = new Set(records.filter((r) => !!r));
  unique.add('us-east-1'); // standard, always show
  const filtered = Array.from(unique);
  filtered.forEach((region, idx) => {
    stack.push({
      isGroup: true,
      title: `Region ${region}`,
      reference: 'RegionGroup',
      id: region,
    });
    loadVPC(state, stack, region);
    if (idx === 0) {
      stack.push({
        from: region,
        to: 'iam',
        arrow: '-[hidden]u->',
      });
    } else {
      stack.push({
        from: region,
        to: filtered[idx - 1],
        arrow: '-[hidden]r->',
      });
    }
    stack.push({
      endGroup: true,
    });
  });
}
