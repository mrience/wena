import { Template } from "aws-cdk-lib/assertions";
import { PackageStorageStack } from "../../src/stacks/package-storage-stack";
import { App } from "aws-cdk-lib";
import { getStackSuffix } from "../../src/utils";

describe("Package Storage Stack", () => {
    let template: Template;
    let packageStorageStack: PackageStorageStack;


    beforeAll(() => {
        const app = new App();
        packageStorageStack = new PackageStorageStack(app, "PackageStorageStack");
        template = Template.fromStack(packageStorageStack);
    });

    it("should create a bucket for test packages", () => {
        template.hasResourceProperties("AWS::S3::Bucket",{
            BucketName: `test-packages-${getStackSuffix(packageStorageStack)}`
        });
    });

    it("should create a bucket for node_modules", () => {
        template.hasResourceProperties("AWS::S3::Bucket", {
            BucketName: `node-modules-${getStackSuffix(packageStorageStack)}`
        });
    });
})