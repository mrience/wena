data "aws_iam_policy_document" "deploy_role_trust_policy" {
  statement {
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${var.aws_account_id_identity}:role/@GithubOidc"]
    }
    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "deploy_role_permissions" {
  statement {
    actions = [
      "iam:CreateRole",
      "iam:TagRole",
      "iam:GetRole",
      "iam:GetRolePolicy",
      "iam:AttachRolePolicy",
      "iam:PutRolePolicy",
      "iam:DeleteRolePolicy",
      "iam:DeleteRole",
      "iam:PassRole",
      "iam:UpdateAssumeRolePolicy"
    ]
    resources = [
      "arn:aws:iam::${var.aws_account_id}:role/*"
    ]
  }
}

resource "aws_iam_role" "deploy_role" {
  name               = "@Deploy"
  assume_role_policy = data.aws_iam_policy_document.deploy_role_trust_policy.json
}

resource "aws_iam_role_policy" "deploy_role_policy_attachment" {
  name   = "deploy-role-policy-attachment"
  role   = aws_iam_role.deploy_role.id
  policy = data.aws_iam_policy_document.deploy_role_permissions.json
}

# Temporary: @Deploy was bootstrapped manually; import it instead of recreating. Remove after first apply on main.
import {
  to = aws_iam_role.deploy_role
  id = "@Deploy"
}

import {
  to = aws_iam_role_policy.deploy_role_policy_attachment
  id = "@Deploy:deploy-role-policy-attachment"
}