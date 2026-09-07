terraform {
    cloud {
        organization = "wena"
        workspaces {
            name = "wena-aws-identity"
        }
    }

    required_providers {
        aws = {
        source  = "hashicorp/aws"
        version = "~> 6.0"
        }
    }
    required_version = ">= 1.5.0"
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

data "aws_iam_policy_document" "github_oidc_trust_policy" {
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

data "aws_iam_policy_document" "github_oidc_role_permissions" {
  statement {
    actions = ["sts:AssumeRole"]
    resources = [ 
      "arn:aws:iam::${var.aws_account_id_dev}:role/@Deploy",
      "arn:aws:iam::${var.aws_account_id_prod}:role/@Deploy",
      "arn:aws:iam::${var.aws_account_id}:role/@Deploy"
     ]
  }
}

resource "aws_iam_role" "github_oidc_role" {
    name = "@GithubOidc"
    assume_role_policy = data.aws_iam_policy_document.github_oidc_trust_policy.json
}

resource "aws_iam_role_policy" "github_oidc_policy_attachment" {
    name = "assume-deploy-roles"
    role = aws_iam_role.github_oidc_role.id
    policy = data.aws_iam_policy_document.github_oidc_role_permissions.json
}

data "aws_iam_policy_document" "deploy_trust_policy" {
  statement {
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = [aws_iam_role.github_oidc_role.arn]
    }
    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "deploy_permissions" {
  
  statement {
    actions   = ["iam:CreateRole", "iam:TagRole"]
    resources = ["*"]
  }

  statement {
    actions = [
      "iam:GetRole",
      "iam:AttachRolePolicy",
      "iam:PutRolePolicy",
      "iam:PassRole",
      "iam:UpdateAssumeRolePolicy"
    ]
    resources = [ 
      "arn:aws:iam::${var.aws_account_id}:role/*"
    ]
  }
}

resource "aws_iam_role_policy" "deploy_role_policy_attachment" {
  name = "deploy-role-policy-attachment"
  role = aws_iam_role.deploy_role.id
  policy = data.aws_iam_policy_document.deploy_permissions.json
}

resource "aws_iam_role" "deploy_role" {
  name = "@Deploy"
  assume_role_policy = data.aws_iam_policy_document.deploy_trust_policy.json 
}
