import { Resource, Stack } from "aws-cdk-lib";
import { LambdaIntegration, RestApi, RestApiProps } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { Interface } from "readline";

export interface ApiStackProps extends RestApiProps {
    lambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
    constructor(construct: Construct, id: string, props: ApiStackProps) {
        super(construct, id, props);
        const api = new RestApi(this, "FrontendApi");
        const resource = api.root.addResource("frontend");
        resource.addMethod("POST", props.lambdaIntegration);
    }
}