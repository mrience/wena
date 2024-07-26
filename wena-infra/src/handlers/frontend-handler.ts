import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Handler } from 'aws-lambda';
import {execa} from 'execa';
import { unzip } from 'zlib';
import { read, readFileSync } from 'fs';
import JSZip = require('jszip');
import { NodeJsClient } from "@smithy/types";


const s3Client = new S3Client({region: 'eu-west-1'}) as NodeJsClient<S3Client>;

interface FrontendAPIEventBody {
  s3TestPackageKey: string;
  s3NodeModulesPackageKey: string;
}

export const handler: Handler = async (event: APIGatewayProxyEvent, context: Context) =>  {

  const eventBody = JSON.parse(event.body as string);
    //dostarczam hashe przez api gateway event

    const s3TestPackageKey = eventBody.s3TestPackageKey;
    const s3NodeModulesPackageKey = eventBody.s3NodeModulesPackageKey;

    // pobieram testy i obiekty z s3 i rozpakowuje
    const s3GetTestPackageCommand = new GetObjectCommand({
      Bucket: "test-packages-06076a666cf9",
      Key: s3TestPackageKey
    });
    const s3GetNodeModulesPackageCommand = new GetObjectCommand({
      Bucket: "node-modules-06076a666cf9",
      Key: s3NodeModulesPackageKey
    });
    // odpalam komendy
    const zippedTestPackage = (await s3Client.send(s3GetTestPackageCommand)).Body as NodeJS.ReadableStream;
    const zipedNodeModulesPackage = (await s3Client.send(s3GetNodeModulesPackageCommand)).Body as NodeJS.ReadableStream;
    const jszip = new JSZip();
    jszip.loadAsync(zippedTestPackage);
    jszip.loadAsync(zipedNodeModulesPackage);


    // unzip(readFileSync())

    await execa `ls`

    await execa`npm run jest`

    const response: APIGatewayProxyResult = {
      statusCode: 201,
      body: JSON.stringify('hello from lambda')
    }
    console.log(event)
    return response;
  };