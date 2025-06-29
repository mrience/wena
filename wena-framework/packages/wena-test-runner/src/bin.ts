#!/usr/bin/env tsx
import Logger from "./utils/logger.ts";
import { uploadTestsPackage, uploadNodeModulesPackage } from "../src/execution-packages.ts";
import { S3Client } from "@aws-sdk/client-s3";
import axios from "axios";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({});

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  region: process.env.AWS_REGION as string,
});

Logger.info("Uploading tests package...");
const s3TestPackageKey = await uploadTestsPackage(s3Client, process.cwd());

Logger.info("Uploading node modules package...");
const s3NodeModulesPackageKey = await uploadNodeModulesPackage(s3Client, `${process.cwd()}/node_modules`);

// call api gateway with the arns
const response = await axios.post("https://fgxcc615dk.execute-api.eu-west-1.amazonaws.com/prod/frontend", {
  projectDirectory: path.basename(process.cwd()),
  s3TestPackageKey: s3TestPackageKey,
  s3NodeModulesPackageKey: s3NodeModulesPackageKey,
});

console.log(`response status: ${response.status} \n response message: ${response.data}`);
// ask for results
