variable "aws_account_id" {
  description = "Development or ProductionAWS account ID to deploy resources in"
    validation {
    condition     = contains(["072055530432", "558824711352"], var.aws_account_id)
    error_message = "AWS account ID must be either the development or production account ID."
  }
}

variable "environment" {
  description = "The environment to deploy resources in (identity, dev, prod)"
  default     = "dev"
  sensitive    = true
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "Environment must be dev or prod."
  }
}

variable "aws_account_id_identity" {
  description = "Identity AWS account ID to deploy resources in"
  default     = "586808671648"
}