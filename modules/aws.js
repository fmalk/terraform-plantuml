export function loadAWS(state, stack) {
  stack.push({
    isGroup: true,
    title: 'AWS',
    reference: 'AWSCloudGroup',
    id: 'aws',
  });
}
