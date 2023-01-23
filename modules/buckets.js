export function loadBuckets(state, stack) {
  const records = state.resources.filter((r) => r.type === 'aws_s3_bucket');
  if (records.length > 0) {
    stack.push({
      isGroup: true,
      title: 'S3 Buckets',
      reference: 'S3Group',
      id: 's3',
    });
    records.forEach((r, idx) => {
      stack.push({
        isGroup: false,
        title: r.instances[0].attributes.bucket,
        reference: '$SimpleStorageServiceBucketIMG()',
        id: `s3_${idx}`,
      });
    });
  }
}
