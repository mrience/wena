import { hashElement } from "folder-hash";
import { GetObjectCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import archiver from "archiver";
import Logger from "./utils/logger";
import * as stream from "stream";
import { Upload } from "@aws-sdk/lib-storage";

enum PackageType {
  NodeModules = "NodeModules",
  Tests = "Tests",
}

type ZipUploadOptions = {
  bucket: string;
  key: string;
  type: PackageType;
  path: string;
};

type S3ObjectKey = string;

type PackageOptions = Pick<ZipUploadOptions, "bucket" | "type" | "path">;

const uploadTestsPackage = async (s3Client: S3Client, path: string) => {
  return await uploadExecutionPackage(s3Client, {
    bucket: "test-packages-06076a666cf9",
    type: PackageType.Tests,
    path: path,
  });
};

const uploadNodeModulesPackage = async (s3Client: S3Client, path: string) => {
  return await uploadExecutionPackage(s3Client, {
    bucket: "node-modules-06076a666cf9",
    type: PackageType.NodeModules,
    path: path,
  });
};

const uploadExecutionPackage = async (s3Client: S3Client, packageOptions: PackageOptions): Promise<S3ObjectKey> => {
  const zipUploadOptions: ZipUploadOptions = {
    ...packageOptions,
    key: await getBase64UrlHashFromDir(packageOptions.path),
  };
  const getObjectInput = {
    Bucket: zipUploadOptions.bucket,
    Key: zipUploadOptions.key,
  };
  const getObjectCommand = new GetObjectCommand(getObjectInput);
  try {
    await s3Client.send(getObjectCommand);
    Logger.info(
      `Package with key ${zipUploadOptions.key} already exists in S3 bucket ${zipUploadOptions.bucket}. No need to upload again.`,
    );
    return zipUploadOptions.key;
  } catch (error) {
    const err = error as S3ServiceException;
    if (err.name == "NoSuchKey") {
      try {
        await uploadZipToS3(s3Client, zipUploadOptions);
      } catch (error) {
        Logger.error(`Error during compression of ${zipUploadOptions.type} package \n ${error}`);
      }
      Logger.info(`Package with key ${zipUploadOptions.key} uploaded to S3 bucket ${zipUploadOptions.bucket}.`);
      return zipUploadOptions.key;
    } else {
      throw error;
    }
  }
};

const getBase64UrlHashFromDir = async (folderPath: string) => {
  const includedFiles =
    process.platform === "win32"
      ? ["**.js", "**.json", "**.ts"]
      : ["*.js", "**/*.js", "*.json", "**/*.json", "*.ts", "**/*.ts"];
  const excludedDirs = folderPath.endsWith("node_modules") ? ["node_modules"] : [];
  const options = {
    files: { include: includedFiles },
    folders: { exclude: excludedDirs },
  };
  const hash = (await hashElement(folderPath, options)).hash;
  const base64UrlHash = Buffer.from(hash).toString("base64url");
  return base64UrlHash;
};

const uploadZipToS3 = async (s3Client: S3Client, options: ZipUploadOptions): Promise<void> => {
  const archiverStream = new stream.PassThrough();

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: options.bucket,
      Key: options.key,
      Body: archiverStream,
      ContentType: "application/zip",
    },
  });

  upload.on("httpUploadProgress", () => {});

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.on("error", (err) => {
    throw err;
  });

  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      Logger.warning(`Warning: ${err.message}`);
    } else {
      throw err;
    }
  });

  if (options.type === PackageType.Tests) {
    archive.directory(options.path, false, (entry) => {
      return entry.name.includes("node_modules") ? false : entry;
    });
  } else if (options.type === PackageType.NodeModules) {
    archive.directory(options.path, false);
  }
  archive.pipe(archiverStream);

  archive.finalize();
  try {
    await upload.done();
  } catch (error) {
    Logger.error(`Error during upload of ${options.type} package: ${error}`);
    throw error;
  }
};

export { uploadTestsPackage, uploadNodeModulesPackage, PackageType };
