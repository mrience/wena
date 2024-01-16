import { App } from "aws-cdk-lib";
import { ApiStack, ApiStackProps } from "../../src/stacks/api-stack";
import { Template, Match } from "aws-cdk-lib/assertions";
import { FrontendLambdaStack } from "../../src/stacks/frontend-lambda-stack";

describe("Api stack", () => {
    let template: Template;

    
    beforeAll(() => {
        const app = new App();
        const lambdaStack = new FrontendLambdaStack(app, "LambdaStack");
        template = Template.fromStack(new ApiStack(app, "ApiStack", {lambdaIntegration: lambdaStack.frontendIntegration}));
    });


    it("should create only one RestApi stack", () => {
        template.resourceCountIs("AWS::ApiGateway::RestApi", 1);
    });

    it("should create RestApi with correct properties", () => {
        template.hasResourceProperties("AWS::ApiGateway::RestApi", 
        Match.objectEquals({
                Name: "FrontendApi"
            })
        );
    });

    it("should integrate with frontend lambda", () => {
        template.hasResourceProperties("AWS::ApiGateway::Method", Match.objectLike( {
            HttpMethod: "POST",
            Integration: {
                Uri: {
                    "Fn::Join": Match.arrayWith([
                        "", [        
                        "arn:",
                        {
                         "Ref": "AWS::Partition"
                        },
                        ":apigateway:",
                        {
                         "Ref": "AWS::Region"
                        },
                        ":lambda:path/2015-03-31/functions/",
                        {
                        "Fn::ImportValue": Match.stringLikeRegexp("LambdaStack.*FrontendLambda")
                        },
                        "/invocations"]
                    ])
                }
            }
        }))
    });
});
