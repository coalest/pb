const { SFNClient, StartExecutionCommand } = require("@aws-sdk/client-sfn");

async function schedulePredictionClosing(userId, predictionId, duration) {
  const response = await new SFNClient().send(
    new StartExecutionCommand({
      stateMachineArn:
        "arn:aws:states:eu-north-1:393809552328:stateMachine:predictionStateMachine",
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
    }),
  );

  return response;
}

module.exports = { schedulePredictionClosing };
