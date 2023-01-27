terraform {
  required_version = ">= 1.3.7"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.36.1"
    }
  }
}

provider "aws" {
  region     = var.default_region
  access_key = "localstack"
  secret_key = "localstsack"

  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
}
