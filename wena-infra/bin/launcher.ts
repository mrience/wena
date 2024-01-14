#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiStack } from '../src/stacks/api-stack';
import { FrontendLambdaStack } from '../src/stacks/frontend-lambda-stack';
import { PackageStorageStack } from '../src/stacks/package-storage-stack';

const app = new cdk.App();

const frontendLambdaStack = new FrontendLambdaStack(app, "LambdaStack");
new ApiStack(app, "ApiStack", {lambdaIntegration: frontendLambdaStack.frontendIntegration});
new PackageStorageStack(app, "PackageStorageStack");
