import { Stack, StackProps, aws_s3 } from "aws-cdk-lib";
import { Construct } from "constructs";

export class PackageStorageStack extends Stack {
    constructor(construct: Construct, id: string, props?: StackProps){
        super(construct, id , props);

        const testBucket = new aws_s3.Bucket(this, "TestPackagesBucket", {
            bucketName: "test-packages"
        });
        const nodeModulesBucket = new aws_s3.Bucket(this, "NodeModulesBucket", {
            bucketName: "node-modules"
        });
    }
}