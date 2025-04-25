"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulePredictionClosing = void 0;
const client_sfn_1 = require("@aws-sdk/client-sfn");
// TODO: Fix hardcoded url and arns to handle other envs (staging/prod/etc)
// TODO: Set retry behavior
const schedulePredictionClosing = async (userId, predictionId, duration) => {
    const response = await new client_sfn_1.SFNClient().send(new client_sfn_1.StartExecutionCommand({
        stateMachineArn: "arn:aws:states:eu-north-1:393809552328:stateMachine:predictionStateMachine",
        name: `close-prediction-${predictionId}`,
        input: JSON.stringify({
            waitSeconds: duration,
            apiDetails: {
                url: "https://8f3eziiwfh.execute-api.eu-north-1.amazonaws.com/dev/predictions/close",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    timestamp: new Date().toISOString(),
                    userId: userId,
                },
            },
        }),
    }));
    return response;
};
exports.schedulePredictionClosing = schedulePredictionClosing;
