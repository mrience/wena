data "aws_iam_policy_document" "deploy_role_trust_policy" {
    statement {
        effect = "Allow"
        principals {
            type = "AWS" 
            identifiers = [ "arn:aws:iam::${var.aws_account_id_identity}:role/@GithubOidc" ]
        }
        actions = [ "sts:AssumeRole" ]
    }
}

data "aws_iam_policy_document" "deploy_role_permissions" {
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

resource "aws_iam_role" "deploy_role" {
    name = "@Deploy"
    assume_role_policy = data.aws_iam_policy_document.deploy_role_trust_policy.json
}

resource "aws_iam_role_policy" "deploy_role_policy_attachment" {
    name = "deploy-role-policy-attachment"
    role = aws_iam_role.deploy_role.id
    policy = data.aws_iam_policy_document.deploy_role_permissions.json
}