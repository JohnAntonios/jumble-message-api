#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { JumbleAPIStack } from "../lib/jumble-api-stack";

const app = new cdk.App();

new JumbleAPIStack(app, "JumbleAPIStack");
