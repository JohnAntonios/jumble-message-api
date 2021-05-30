import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apig from "@aws-cdk/aws-apigatewayv2";
import * as apigintegration from "@aws-cdk/aws-apigatewayv2-integrations";
import { join } from "path";

export class JumbleAPIStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda Functions
    const jumbleMessageFunction = new lambda.DockerImageFunction(
      this,
      "jumbleMessageFunction",
      {
        functionName: "jumbleMessageFunction",
        code: lambda.DockerImageCode.fromImageAsset(
          join(__dirname, "../functions/jumble-api-function"),
          {
            cmd: ["dist/functions/jumbleMessage.index"],
            entrypoint: ["/lambda-entrypoint.sh"],
          }
        ),
      }
    );

    // Lambda & API Gateway integration
    const jumbleMessageFunctionIntegration = new apigintegration.LambdaProxyIntegration(
      {
        handler: jumbleMessageFunction,
      }
    );

    // API Gateway instantiation
    const httpApi = new apig.HttpApi(this, "jumbleMessageHttpApi", {
      apiName: "jumbleMessageHttpApi",
    });

    // API Gateway routes
    httpApi.addRoutes({
      path: "/api/jumble/{n}",
      methods: [apig.HttpMethod.POST],
      integration: jumbleMessageFunctionIntegration,
    });

    // Log out service and endpoint
    const httpApiEndpoint = httpApi.apiEndpoint;
    const jumbleMessageFunctionEndpoint = httpApiEndpoint + "/api/jumble/{n}";

    new cdk.CfnOutput(this, "Jumble Word API: ", { value: httpApiEndpoint });
    new cdk.CfnOutput(
      this,
      "Jumble Word API endpoint - jumbleMessageFunction: ",
      { value: jumbleMessageFunctionEndpoint }
    );
  }
}
