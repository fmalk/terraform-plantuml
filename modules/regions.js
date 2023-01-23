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
    stack.push({
      endGroup: true,
      hiddenArrow:
        idx === 0 ? `${region.replace(/-/g, '_')} -[hidden]u-> iam` : `${region.replace(/-/g, '_')} -[hidden]r-> ${filtered[idx - 1].replace(/-/g, '_')}`,
    });
  });
}
