resource "aws_iam_user" "alice" {
  name = lower("${var.prefix}-alice")
}

resource "aws_iam_user" "bob" {
  name = lower("${var.prefix}-bob")
}
