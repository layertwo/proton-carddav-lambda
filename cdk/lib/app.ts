import "source-map-support/register";
import {App} from "aws-cdk-lib";
import {ProtonCarddavStack} from "./stacks/proton-carddav-lambda-stack";

const app = new App();
new ProtonCarddavStack(app, "proton-carddav-lambda-stack", {env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
},
});
