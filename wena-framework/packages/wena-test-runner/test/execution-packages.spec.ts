import { mockClient } from "aws-sdk-client-mock";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { uploadNodeModulesPackage, uploadTestsPackage } from "../src/execution-packages";
import "aws-sdk-client-mock-jest";

describe("execution packages", () => {
  const s3Client = new S3Client({ region: "eu-west-1" });
  const s3mockClient = mockClient(s3Client);
  const error = new Error();
  error.name = "NoSuchKey";
  const testProjectPath = "./packages/wena-test-runner/test/data/dummy_project";

  beforeEach(() => {
    s3mockClient.reset();
  });

  it("should return S3 bucket key for tests package", async () => {
    s3mockClient.on(GetObjectCommand).rejects(error).on(PutObjectCommand).resolves({});

    const key = await uploadTestsPackage(s3Client, testProjectPath);

    expect(key).toEqual("MW84QllHOU42RHRDbzFqUWs0ZFZUaUUzMUlrPQ");
  }, 180000);

  it("should return S3 bucket key for node modules package", async () => {
    s3mockClient.on(GetObjectCommand).rejects(error).on(PutObjectCommand).resolves({});

    const key = await uploadNodeModulesPackage(s3Client, `${testProjectPath}/node_modules`);

    expect(key).toEqual("QVFybzBLaWNaOW8wT2Y5WE5Ld3J2Y01nd2swPQ");
  });

  it("should upload tests package", async () => {
    s3mockClient.on(GetObjectCommand).rejects(error).on(PutObjectCommand).resolves({});

    await uploadTestsPackage(s3Client, testProjectPath);

    expect(s3mockClient).toHaveReceivedCommand(GetObjectCommand);
    expect(s3mockClient).toHaveReceivedCommand(PutObjectCommand);
  });

  it("should upload node modules package", async () => {
    const error = new Error();
    error.name = "NoSuchKey";

    s3mockClient.on(GetObjectCommand).rejects(error).on(PutObjectCommand).resolves({});

    await uploadNodeModulesPackage(s3Client, `${testProjectPath}/node_modules`);

    expect(s3mockClient).toHaveReceivedCommand(GetObjectCommand);
    expect(s3mockClient).toHaveReceivedCommand(PutObjectCommand);
  });

  it("should not upload package when hash already exists", async () => {
    s3mockClient.on(GetObjectCommand).resolves({}).on(PutObjectCommand).resolves({});

    await uploadTestsPackage(s3Client, testProjectPath);

    expect(s3mockClient).toHaveReceivedCommand(GetObjectCommand);
    expect(s3mockClient).toHaveReceivedCommandTimes(PutObjectCommand, 0);
  });
});
