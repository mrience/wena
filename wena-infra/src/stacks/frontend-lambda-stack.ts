import { Stack } from "aws-cdk-lib";
import { Integration, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

export class FrontendLambdaStack extends Stack {
    public readonly frontendIntegration: LambdaIntegration;

    constructor(construct: Construct, id: string, props?: NodejsFunctionProps) {
        super(construct, id, props);

        const frontendLambda = new NodejsFunction(this, "FrontendLambda", {
            runtime: Runtime.NODEJS_18_X,
            entry: join(__dirname, "..", "handlers", "frontend-handler.ts"),
            handler: "handler"
        });
        this.frontendIntegration = new LambdaIntegration(frontendLambda);
    }
}