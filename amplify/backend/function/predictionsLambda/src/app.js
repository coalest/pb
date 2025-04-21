/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const {
  SchedulerClient,
  CreateScheduleCommand,
} = require("@aws-sdk/client-scheduler");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const bodyParser = require("body-parser");
const express = require("express");
const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  convertClassInstanceToMap: true,
});

const { Prediction, PredictionAlreadyClosed } = require("./models/prediction");
const {
  User,
  UserNotFound,
  PredictionInProgress,
  InvalidDirection,
} = require("./models/user");

let tableName = "usersTable";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + "-" + process.env.ENV;
}

const path = "/predictions";

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const scheduler = new SchedulerClient({ region: "eu-north-1" });

async function scheduleClosing(userId, durationInSeconds) {
  const durationInMilliseconds = durationInSeconds * 1000;
  const scheduleName = `trigger-close-prediction-lambda-${Date.now()}`;
  const scheduledTime = new Date(
    Date.now() + durationInMilliseconds,
  ).toISOString();

  // TODO: Dev env hardcoded here for lambda Arn
  const params = {
    Name: scheduleName,
    ScheduleExpression: `at(${scheduledTime.slice(0, -5)})`,
    Target: {
      Arn: "arn:aws:lambda:eu-north-1:393809552328:function:predictionsLambda-dev",
      RoleArn:
        "arn:aws:iam::393809552328:role/predictabitLambdaRole9b00e3de-dev",
      Input: JSON.stringify({
        Body: JSON.stringify({
          timestamp: new Date().toISOString(),
          scheduledTime: scheduledTime,
          userId: userId,
        }),
        Method: "POST",
        Uri: "https://8f3eziiwfh.execute-api.eu-north-1.amazonaws.com/dev/predictions/close",
        Headers: {
          "Content-Type": "application/json",
        },
      }),
    },
    FlexibleTimeWindow: {
      Mode: "OFF",
    },
  };
  console.log(params);

  try {
    const command = new CreateScheduleCommand(params);
    const result = await scheduler.send(command);
    console.log("Schedule created successfully:", result);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Second Lambda scheduled to run at ${scheduledTime}`,
        scheduleName: scheduleName,
      }),
    };
  } catch (err) {
    console.error("Error creating schedule:", err);
    throw err;
  }
}

/************************************
 * HTTP post method to place a prediction *
 *************************************/

app.post(path + "/place", async function (req, res) {
  try {
    let user;
    try {
      user = await User.findById(req.body.userId);
    } catch (err) {
      if (err instanceof UserNotFound) {
        return res.status(404).json({ error: "User not found" });
      }
      throw err;
    }

    try {
      await user.predict(req.body.direction);
      const duration =
        req.body.duration || Prediction.DEFAULT_DURATION_IN_SECONDS;
      // await scheduleClosing(user.id, duration);
      return res.status(200).json(user);
    } catch (err) {
      if (err instanceof PredictionInProgress) {
        return res
          .status(400)
          .json({ error: "A prediction is already in progress" });
      } else if (err instanceof InvalidDirection) {
        return res.status(400).json({ error: "Invalid direction provided" });
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/************************************
 * HTTP post method to close a prediction *
 *************************************/

app.post(path + "/close", async function (req, res) {
  try {
    let user;
    try {
      user = await User.findById(req.body.userId);
    } catch (err) {
      if (err instanceof UserNotFound) {
        return res.status(404).json({ error: "User not found" });
      }
      throw err;
    }

    try {
      const finalPrice = 80_234_01;
      const lastPrediction = user.getLastPrediction().close(finalPrice);

      user.closeLastPrediction(lastPrediction);

      return res.status(200).json(user);
    } catch (err) {
      if (err instanceof PredictionAlreadyClosed) {
        return res
          .status(422)
          .json({ error: "That prediction has already finished." });
      } else if (err instanceof InvalidDirection) {
        return res.status(400).json({ error: "Invalid direction provided" });
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
