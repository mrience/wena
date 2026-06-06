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
 
resource "aws_iam_openid_connect_provider" "oidc_provider" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com",
  ]
}

data "aws_iam_policy_document" "oidc_assume_role" {
    statement {
        effect = "Allow"
    
        principals {
        type        = "Federated"
        identifiers = [aws_iam_openid_connect_provider.oidc_provider.arn]
        }
    
        actions = ["sts:AssumeRoleWithWebIdentity"]
        
        condition {
        test     = "StringEquals"
        values   = ["sts.amazonaws.com"]
        variable = "token.actions.githubusercontent.com:aud"
        }

        condition {
            test     = "StringLike"
            variable = "token.actions.githubusercontent.com:sub"
    
            values = ["repo:mrience/wena:*"]
        }
    }
}

resource "aws_iam_role" "github_oidc_role" {
    name = "@GithubOidc"
    assume_role_policy = data.aws_iam_policy_document.oidc_assume_role.json
}