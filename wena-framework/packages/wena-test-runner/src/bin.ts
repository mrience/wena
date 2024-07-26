#!/usr/bin/env ts-node
import Logger from './utils/logger.ts';
import { uploadTestsPackage, uploadNodeModulesPackage } from "serverless-services";
import{ S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import axios from "axios";

// interface FrontendLambdaPayload {
//     s3TestPackageKey: string;
//     s3NodeModulesPackageKey: string;

// }

const s3Client = new S3Client(
    {credentials: fromEnv()}
    );

Logger.info("Starting test execution...");

Logger.info("Uploading test packages...");
const testPackageHash = await uploadTestsPackage(s3Client);

const nodeModulesPackageHash = await uploadNodeModulesPackage(s3Client);

// call api gateway with the arns
const response = await axios.post("https://fgxcc615dk.execute-api.eu-west-1.amazonaws.com/prod/frontend", {
    s3TestPackageKey: testPackageHash,
    s3NodeModulesPackageKey: nodeModulesPackageHash,
})

console.log(`response status: ${response.status} \n response message: ${response.data}`)
// ask for results