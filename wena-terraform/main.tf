terraform {
    required_providers {
        aws = {
        source  = "hashicorp/aws"
        version = "~> 6.0.0"
        }
    }
    required_version = ">= 1.5.0"
}

variable "aws_region" {
  description = "The AWS region to deploy resources in"
  default     = "eu-west-1"
}

provider "aws" {
  region  = var.aws_region
}