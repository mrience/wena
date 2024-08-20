import { Duration, Stack } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import  * as lambda  from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

export class FrontendLambdaStack extends Stack {
    public readonly frontendIntegration: LambdaIntegration;

    constructor(construct: Construct, id: string, props?: NodejsFunctionProps) {
        super(construct, id, props);

        const frontendLambda = new NodejsFunction(this, "FrontendLambda", {
            runtime: lambda.Runtime.NODEJS_18_X,
            entry: join(__dirname, '..', 'handlers', 'frontend-handler.ts'),
            handler: "handler",
            timeout: Duration.minutes(1),
        });
        this.frontendIntegration = new LambdaIntegration(frontendLambda);
    }
}