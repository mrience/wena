import { App } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { FrontendLambdaStack } from "../../src/stacks/frontend-lambda-stack";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";

describe("Lambs stack", () => {
    let template: Template;

    beforeAll(() => {
        const app = new App();
        const lambdaStack = new FrontendLambdaStack(app, "FrontendLambdaStack");
        template = Template.fromStack(lambdaStack);
     });

    it("should have frontend lambda resource", () => {
        const resources = template.findResources("AWS::Lambda::Function");
        const frontendLambdaMatching = expect.stringMatching(/FrontendLambda.*/);

        expect(Object.keys(resources)).toContainEqual(frontendLambdaMatching);

    });

    it('should have props frontend lambda', () => {
        template.hasResourceProperties("AWS::Lambda::Function", Match.objectLike({
            Runtime: "nodejs18.x",
            Handler: "index.handler",
        }));
    });
});