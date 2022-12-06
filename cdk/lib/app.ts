#!/usr/bin/env node
import "source-map-support/register";
import {App} from "aws-cdk-lib";
import {ProtonCarddavStack} from "./stacks/proton-carddav-lambda-stack";

const app = new App();
new ProtonCarddavStack(app, "proton-carddav-lambda-stack");
