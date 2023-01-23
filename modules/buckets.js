export function loadBucket(state, stack) {
  const records = state.resources.filter((r) => r.type === 'aws_s3_bucket');
  stack.push({
    isGroup: true,
    title: 'S3',
    reference: 'S3BucketGroup',
    id: 's3',
  });
  records.forEach((r, idx) => {
    stack.push({
      isGroup: false,
      title: r.instances[0].attributes.bucket,
      reference: 'SimpleStorageServiceBucketIMG',
      id: `s3_${idx}`,
    });
  });
  stack.push({
    from: 's3',
    to: 'iam',
    arrow: '-[hidden]r->',
  });
  stack.push({
    endGroup: true,
  });
}
