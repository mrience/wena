import { Template } from "aws-cdk-lib/assertions";
import { PackageStorageStack } from "../../src/stacks/package-storage-stack";
import { App } from "aws-cdk-lib";

describe("Package Storage Stack", () => {
    let template: Template;

    beforeAll(() => {
        const app = new App();
        const packageStorageStack = new PackageStorageStack(app, "PackageStorageStack");
        template = Template.fromStack(packageStorageStack);
    });

    it("should create a bucket for test packages", () => {
        template.hasResourceProperties("AWS::S3::Bucket",{
            BucketName: "test-packages"
        });
    });

    it("should create a bucket for node_modules", () => {
        template.hasResourceProperties("AWS::S3::Bucket", {
            BucketName: "node-modules"
        });
    });
})