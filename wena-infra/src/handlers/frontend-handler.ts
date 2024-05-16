import { S3Client } from '@aws-sdk/client-s3';
import { Handler } from 'aws-lambda';


const s3 = new S3Client({region: 'eu-west-1'});

export const handler: Handler = async (event, context) => {
    

    return
  };