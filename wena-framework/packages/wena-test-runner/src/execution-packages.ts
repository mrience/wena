import { hashElement } from "folder-hash";
import { GetObjectCommand, PutObjectCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import archiver from "archiver";
import Logger from "./utils/logger";
import * as stream from 'stream';

enum PackageType {
    NodeModules = "NodeModules",
    Tests = "Tests",
}

type ExecutionPackage = {
    bucket: string,
    type: PackageType,
}


const uploadTestsPackage = async (s3Client: S3Client) => {
    return await uploadExecutionPackage(
        s3Client,
        {
        bucket: "test-packages-06076a666cf9",
        type: PackageType.Tests
    });
};

const uploadNodeModulesPackage = async (s3Client: S3Client) => {
    return await uploadExecutionPackage(
        s3Client,
        {
        bucket: "node-modules-06076a666cf9",
        type: PackageType.NodeModules
    });
};


const uploadExecutionPackage = async (s3Client: S3Client, executionPackage: ExecutionPackage) => {
    const folderPath = getWorkingDirectoryPath(executionPackage.type);
    const hash = await gethashFromDir(executionPackage.type);
    const getObjectInput = {
        Bucket: executionPackage.bucket,
        Key: hash
    };
    const getObjectCommand = new GetObjectCommand(getObjectInput);
    try {
        await s3Client.send(getObjectCommand);
        return hash;
    } catch (error) {
        const err = error as S3ServiceException;
        if (err.name == "NoSuchKey") {
            try {
                const archiveStream = new stream.PassThrough();
                uploadZipToS3(s3Client, executionPackage.bucket, hash, archiveStream);
                const archive = archiver('zip', { zlib: { level: 9 } });
                archive.on('error', (err) => {
                    throw err;
                });
                archive.pipe(archiveStream);
                archive.directory(folderPath, false);
                await archive.finalize();
            } catch(error) {
                Logger.error(`Error during compression of ${executionPackage.type} package \n ${error}`);
            }
            return hash;
        } else {
            throw error;
        }
    }
};

const getWorkingDirectoryPath = (packageType: PackageType) => {
    let workingDirPath: string;

    switch(packageType) {
        case PackageType.Tests: {
            workingDirPath = ".";
            break;
        }
        case PackageType.NodeModules: {
            workingDirPath = "node_modules";
            break;
        }
    }
    return `${__dirname}/${workingDirPath}`;
};

const gethashFromDir = async (folderPath: string) => {
    const includedFiles = process.platform === "win32"? ["**.js", "**.json", "**.ts"]
        : ["*.js", "**/*.js", "*.json", "**/*.json", "*.ts", "**/*.ts"];
    const excludedDirs = folderPath.endsWith("node_modules") ? ["node_modules"] : []; 
    const options = {
        files: {include: includedFiles},
        folders: {exclude: excludedDirs}
    };
    const hash = (await hashElement(folderPath, options)).hash;

    return hash;
};


const uploadZipToS3 = async (s3Client: S3Client, bucket: string, key: string, stream: stream.PassThrough): Promise<void> => {
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: stream,
        ContentType: "application/zip",
    });

    try {
        const response = await s3Client.send(command);
        Logger.info(`Package uploaded successfully. ${response}`);
    } catch (error) {
        Logger.error(`Error uploading package:, ${error}`);
    }

};

export {uploadTestsPackage, uploadNodeModulesPackage, PackageType }