import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Handler } from 'aws-lambda';
import {execa} from 'execa';
import JSZip = require('jszip');
import { NodeJsClient } from "@smithy/types";


const s3Client = new S3Client({region: 'eu-west-1'}) as NodeJsClient<S3Client>;

interface FrontendAPIEventBody {
  s3TestPackageKey: string;
  s3NodeModulesPackageKey: string;
}

export const handler: Handler = async (event: APIGatewayProxyEvent, context: Context) =>  {

  const eventBody = JSON.parse(event.body as string);

  let { stdout } = await execa('ls', ['-la', '/tmp']);
  console.log('Files in /tmp:', stdout);

    // pobieram testy i obiekty z s3 i rozpakowuje
    const s3GetTestPackageCommand = new GetObjectCommand({
      Bucket: "test-packages-06076a666cf9",
      Key: eventBody.s3TestPackageKey
    });
    const s3GetNodeModulesPackageCommand = new GetObjectCommand({
      Bucket: "node-modules-06076a666cf9",
      Key: eventBody.s3NodeModulesPackageKey
    });

    await execa `cd /tmp/ `;

    await execa `ls`;

    // pobieram paczki z s3
    const zippedTestPackageStream = (await s3Client.send(s3GetTestPackageCommand)).Body as NodeJS.ReadableStream;
    // const zipedNodeModulesPackageStream = (await s3Client.send(s3GetNodeModulesPackageCommand)).Body as NodeJS.ReadableStream;
    const zippedTestPackageBuffer = await streamToBuffer(zippedTestPackageStream);
    // const zipedNodeModulesPackageBuffer = await streamToBuffer(zipedNodeModulesPackageStream);
    const jszip = new JSZip();
    // rozpakowuję paczkę
    const file = await jszip.loadAsync(zippedTestPackageBuffer);
    // jszip.loadAsync(zipedNodeModulesPackageBuffer);

    await execa `cd ${eventBody.projectDirectory}`;

    await execa `npm run jest`

    const response: APIGatewayProxyResult = {
      statusCode: 201,
      body: JSON.stringify('hello from lambda')
    }

    return response;
  };

  function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk => chunks.push(chunk)));
      stream.on("end", () => {resolve(Buffer.concat(chunks))});
      stream.on("error", reject);
    });

  }