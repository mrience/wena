#!/usr/bin/env ts-node
import Logger from './utils/logger.ts';
import { uploadTestsPackage, uploadNodeModulesPackage } from "serverless-services";
import{ S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-provider-env";

const s3Client = new S3Client(
    {credentials: fromEnv()}
    );

Logger.info("Starting test execution...");

Logger.info("Uploading test packages...");
await uploadTestsPackage(s3Client);

await uploadNodeModulesPackage(s3Client);

// upload packages if not and return their arns

// call api gateway with the arns

// ask for results