/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import awsServerlessExpressMiddleware from "aws-serverless-express/middleware";
import bodyParser from "body-parser";
import express from "express";

import { Prediction, PredictionAlreadyClosed } from "./models/prediction";
import { fetchBitcoinPrice } from "./utils/fetchBitcoinPrice.js";
import { schedulePredictionClosing } from "./utils/schedulePredictionClosing";
import {
  User,
  UserNotFound,
  PredictionInProgress,
  InvalidDirection,
} from "./models/user";

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

/************************************
 * HTTP post method to place a prediction *
 *************************************/

app.post(path + "/place", async function (req, res) {
  try {
    let user: User | null;
    try {
      user = await User.findById(req.body.userId);
    } catch (err) {
      if (err instanceof UserNotFound) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      throw err;
    }

    try {
      const direction = req.body.direction;
      const duration = req.body.duration
        ? Number(req.body.duration)
        : Prediction.DEFAULT_DURATION_IN_SECONDS;
      const startPrice = await fetchBitcoinPrice();

      // TODO: Wrap these two async functions with Promise.all and rollback
      // completed action if other one fails
      await user.predict(startPrice, direction, duration);
      console.log("user :", user);
      const lastPredictionId = user.getLastPrediction().id;
      await schedulePredictionClosing(user.id, lastPredictionId, duration);

      res.status(200).json(user);
      return;
    } catch (err) {
      if (err instanceof PredictionInProgress) {
        res.status(400).json({ error: "A prediction is already in progress" });
        return;
      } else if (err instanceof InvalidDirection) {
        res.status(400).json({ error: "Invalid direction provided" });
        return;
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

/************************************
 * HTTP post method to close a prediction *
 *************************************/

app.post(path + "/close", async function (req, res) {
  try {
    let user: User;
    try {
      user = await User.findById(req.body.userId);
    } catch (err) {
      if (err instanceof UserNotFound) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      throw err;
    }

    try {
      const finalPrice = await fetchBitcoinPrice();
      const lastPrediction = user.getLastPrediction().close(finalPrice);

      await user.closeLastPrediction(lastPrediction);

      res.status(200).json(user);
      return;
    } catch (err) {
      if (err instanceof PredictionAlreadyClosed) {
        res
          .status(422)
          .json({ error: "That prediction has already finished." });

        return;
      } else if (err instanceof InvalidDirection) {
        res.status(400).json({ error: "Invalid direction provided" });
        return;
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

app.listen(3000, function () {
  console.log("App started");
});

export { app };
