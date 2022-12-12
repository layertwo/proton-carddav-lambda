import {Stack, StackProps, Duration} from "aws-cdk-lib";
import {Construct} from "constructs";
import {ManagedPolicy} from "aws-cdk-lib/aws-iam";
import {DockerImageFunction, DockerImageCode} from "aws-cdk-lib/aws-lambda";
import {HttpMethod, HttpApi} from "@aws-cdk/aws-apigatewayv2-alpha";
import {HttpLambdaIntegration} from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {Secret, ISecret} from "aws-cdk-lib/aws-secretsmanager";
import path = require("path");

function buildLambda(scope: Construct, functionName: string): DockerImageFunction {
    const func = new DockerImageFunction(scope, functionName, {
        functionName,
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
    readonly credentialSecret: ISecret;
    readonly carddavLambda: DockerImageFunction;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // this.httpApi = this.buildHttpApi();
        this.credentialSecret = Secret.fromSecretNameV2(
            this, "proton-secret", "proton-mail-credentials");
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
        const functionName = "proton-carddav-lambda";
        const func = buildLambda(this, functionName);

        // allow function to read credentials secret
        this.credentialSecret.grantRead(func);
        func.addEnvironment("SECRET_ARN", this.credentialSecret.secretArn);

        return func;

    }
}
