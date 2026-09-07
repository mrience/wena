variable "aws_account_id_dev" {
  description = "Development AWS account ID to deploy resources in"
  default     = "072055530432"
}

variable "aws_account_id_prod" {
  description = "Production AWS account ID to deploy resources in"
  default     = "558824711352"
} 

variable "aws_account_id" {
  description = "Identity AWS account ID to deploy resources in"
  default     = "586808671648"
}

variable "aws_region" {
  description = "The AWS region to deploy resources in"
  default     = "eu-west-1"
}