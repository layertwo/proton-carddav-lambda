import {Stack, StackProps, Duration} from "aws-cdk-lib";
import {Construct} from "constructs";
import {ManagedPolicy} from "aws-cdk-lib/aws-iam";
import {DockerImageFunction, DockerImageCode} from "aws-cdk-lib/aws-lambda";
import {HttpMethod, HttpApi} from "@aws-cdk/aws-apigatewayv2-alpha";
import {HttpLambdaIntegration} from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import path = require("path");

function buildLambda(scope: Construct, name: string): DockerImageFunction {
    const func = new DockerImageFunction(scope, name, {
        functionName: name,
        code: DockerImageCode.fromImageAsset(path.join(__dirname, "../../../lambda/")),
        timeout: Duration.minutes(1),
    });
    if (func.role != undefined) {
        func.role.addManagedPolicy(
            ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));
        func.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("CloudWatchFullAccess"));
    }

    return func;
}

export class ProtonCarddavStack extends Stack {

    readonly httpApi: HttpApi;
    readonly carddavLambda: DockerImageFunction;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // this.httpApi = this.buildHttpApi();
        this.carddavLambda = this.buildCarddavLambda();
        // this.buildHttpRoutes();
    }

    private buildHttpApi(): HttpApi {
        const name = "http-api";
        return new HttpApi(this, "HttpApi", {apiName: name, createDefaultStage: true});
    }

    private buildHttpRoutes(): void {
        this.httpApi.addRoutes({
            integration: new HttpLambdaIntegration("get-integration", this.carddavLambda),
            methods: [HttpMethod.GET],
            path: "/list",
        });
    }

    private buildCarddavLambda(): DockerImageFunction {
        const name = "proton-carddav-lambda";
        return buildLambda(this, name);
    }
}
