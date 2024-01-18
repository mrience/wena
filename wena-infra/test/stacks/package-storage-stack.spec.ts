import { Template, Match } from "aws-cdk-lib/assertions";
import { PackageStorageStack } from "../../src/stacks/package-storage-stack";
import { App } from "aws-cdk-lib";

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
            BucketName: Match.objectEquals({
                "Fn::Join": [
                "",
                [
                 "test-packages-",
                 {
                  "Fn::Select": [
                   6,
                   {
                    "Fn::Split": [
                     "-",
                     {
                      "Ref": "AWS::StackId"
                     }
                    ]
                   }
                  ]
                 }
                ]
               ]})
        });
    });

    it("should create a bucket for node_modules", () => {
        template.hasResourceProperties("AWS::S3::Bucket", {
            BucketName: Match.objectEquals({
                "Fn::Join": [
                    "",
                    [
                     "node-modules-",
                     {
                      "Fn::Select": [
                       6,
                       {
                        "Fn::Split": [
                         "-",
                         {
                          "Ref": "AWS::StackId"
                         }
                        ]
                       }
                      ]
                    }
                    ]
                ]
            })
        });
    });
})