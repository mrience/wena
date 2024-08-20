import { hashElement } from "folder-hash";
import { GetObjectCommand, PutObjectCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import JSZip from "jszip";

enum PackageType {
    NodeModules = "NodeModules",
    Tests = "Tests"
}

type ExecutionPackage = {
    bucket: string,
    type: PackageType
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
    const hash = await gethashFromDir(executionPackage.type);

    const getObjectInput = {
        Bucket: executionPackage.bucket,
        Key: hash
    }
    const getObjectCommand = new GetObjectCommand(getObjectInput);
    try {
        await s3Client.send(getObjectCommand);
        return hash;
    } catch (error) {
        const err = error as S3ServiceException;
        if (err.name == "NoSuchKey") {
            const zippedPackage = await zipFolder(executionPackage.type);
            const putObjectInput = {
                Bucket: executionPackage.bucket,
                Key: hash,
                Body: zippedPackage
            }
            // Instead of PutObjectCommant we could use Upload class from @aws-sdk/lib-storage
            // that can perform pararell upload. Unfortunatelly it does not work for some reason. 
            // More at https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-storage/
            const putObjectCommand = new PutObjectCommand(putObjectInput);
            
            await s3Client.send(putObjectCommand);
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
    return workingDirPath;
};

const gethashFromDir = async (packageType: PackageType) => {
    const workingDirPath = getWorkingDirectoryPath(packageType);
    const includedFiles = process.platform === "win32"? ["**.js", "**.json", "**.ts"]
        : ["*.js", "**/*.js", "*.json", "**/*.json", "*.ts", "**/*.ts"];
    const excludedDirs = packageType == PackageType.NodeModules ? ["node_modules"] : []; 
    const options = {
        files: {include: includedFiles},
        folders: {exclude: excludedDirs}
    };
    const hash = (await hashElement(workingDirPath, options)).hash;

    return hash;
};

// FIXME: zip should exclude node_modules for tests package (now it takes all, because path is ./)
const zipFolder = async (packageType: PackageType) => {
    const workingDirPath = getWorkingDirectoryPath(packageType);
    const zip = await (new JSZip().folder(workingDirPath)?.generateAsync({type: "nodebuffer"}));

    return zip;
};

export {uploadTestsPackage, uploadNodeModulesPackage, zipFolder, PackageType }