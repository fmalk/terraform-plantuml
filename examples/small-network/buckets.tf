resource "aws_s3_bucket" "files" {
  bucket = lower("${var.prefix}-files")
}

resource "aws_s3_bucket_acl" "bucket-files-acl" {
  bucket = aws_s3_bucket.files.id
  acl    = "private"
}

resource "aws_s3_bucket" "reports" {
  bucket = lower("${var.prefix}-reports")
}

resource "aws_s3_bucket_acl" "bucket-reports-acl" {
  bucket = aws_s3_bucket.reports.id
  acl    = "private"
}
