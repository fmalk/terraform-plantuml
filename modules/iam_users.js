export function loadIamUsers(state, stack) {
  const records = state.resources.filter((r) => r.type === 'aws_iam_user');
  if (records.length > 0) {
    stack.push({
      isGroup: true,
      title: 'IAM',
      reference: 'IAMGroup',
      id: 'iam',
    });
    records.forEach((r, idx) => {
      stack.push({
        isGroup: false,
        title: r.instances[0].attributes.name,
        reference: 'UserIMG',
        id: `iam_user_${idx}`,
      });
    });
    stack.push({
      endGroup: true,
    });
  }
}
