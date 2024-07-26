import { mockClient } from "aws-sdk-client-mock";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { uploadNodeModulesPackage, uploadTestsPackage } from '../src/execution-packages';
import 'aws-sdk-client-mock-jest';
import {mkdtemp, existsSync} from 'fs';

describe("execution packages", () => {
    const s3Client = new S3Client();
    const s3mockClient = mockClient(s3Client);
    const error = new Error();
    error.name = "NoSuchKey";

    beforeEach(() => {
        s3mockClient.reset();
    });

    it("should return hash when a new package is uploaded", async () => {
        s3mockClient
            .on(GetObjectCommand)
            .rejects(error)
            .on(PutObjectCommand)
            .resolves({});

        const hash = await uploadTestsPackage(s3Client);

        expect(hash).toBeTruthy();
    });

    it("should call aws methods when a package is uploaded", async () => {
        s3mockClient
            .on(GetObjectCommand)
            .rejects(error)
            .on(PutObjectCommand)
            .resolves({});

        await uploadTestsPackage(s3Client);

        expect(s3mockClient).toHaveReceivedCommand(GetObjectCommand);
        expect(s3mockClient).toHaveReceivedCommand(PutObjectCommand);
    });

    it("should upload node modulest package", async () => {
        s3mockClient
        .on(GetObjectCommand)
        .rejects(error)
        .on(PutObjectCommand)
        .resolves({});

        await uploadNodeModulesPackage(s3Client);

        expect(s3mockClient).toHaveReceivedCommand(GetObjectCommand);
        expect(s3mockClient).toHaveReceivedCommand(PutObjectCommand);
    });

    it("should not upload package when object exists", async () => {
        const nodeModulesDir = './node_modules';
        if(!existsSync(nodeModulesDir)) {
            mkdtemp(nodeModulesDir, () => {});            
        }
        s3mockClient
        .on(GetObjectCommand)                                                                                                                                                                                                                                        
        .resolves({})
        .on(PutObjectCommand)
        .resolves({});

        await uploadTestsPackage(s3Client);

        expect(s3mockClient).toHaveReceivedCommand(GetObjectCommand);
        expect(s3mockClient).toHaveReceivedCommandTimes(PutObjectCommand, 0);
    });
});