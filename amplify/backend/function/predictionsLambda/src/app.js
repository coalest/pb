"use strict";
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const middleware_1 = __importDefault(require("aws-serverless-express/middleware"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const prediction_1 = require("./models/prediction");
const fetchBitcoinPrice_js_1 = require("./utils/fetchBitcoinPrice.js");
const schedulePredictionClosing_1 = require("./utils/schedulePredictionClosing");
const user_1 = require("./models/user");
const path = "/predictions";
// declare a new express app
const app = (0, express_1.default)();
exports.app = app;
app.use(body_parser_1.default.json());
app.use(middleware_1.default.eventContext());
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
        let user;
        try {
            user = await user_1.User.findById(req.body.userId);
        }
        catch (err) {
            if (err instanceof user_1.UserNotFound) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            throw err;
        }
        try {
            const direction = req.body.direction;
            const duration = req.body.duration
                ? Number(req.body.duration)
                : prediction_1.Prediction.DEFAULT_DURATION_IN_SECONDS;
            const startPrice = await (0, fetchBitcoinPrice_js_1.fetchBitcoinPrice)();
            // TODO: Wrap these two async functions with Promise.all and rollback
            // completed action if other one fails
            await user.predict(startPrice, direction, duration);
            console.log("user :", user);
            const lastPredictionId = user.getLastPrediction().id;
            await (0, schedulePredictionClosing_1.schedulePredictionClosing)(user.id, lastPredictionId, duration);
            res.status(200).json(user);
            return;
        }
        catch (err) {
            if (err instanceof user_1.PredictionInProgress) {
                res.status(400).json({ error: "A prediction is already in progress" });
                return;
            }
            else if (err instanceof user_1.InvalidDirection) {
                res.status(400).json({ error: "Invalid direction provided" });
                return;
            }
            else {
                throw err;
            }
        }
    }
    catch (err) {
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
        let user;
        try {
            user = await user_1.User.findById(req.body.userId);
        }
        catch (err) {
            if (err instanceof user_1.UserNotFound) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            throw err;
        }
        try {
            const finalPrice = await (0, fetchBitcoinPrice_js_1.fetchBitcoinPrice)();
            const lastPrediction = user.getLastPrediction().close(finalPrice);
            await user.closeLastPrediction(lastPrediction);
            res.status(200).json(user);
            return;
        }
        catch (err) {
            if (err instanceof prediction_1.PredictionAlreadyClosed) {
                res
                    .status(422)
                    .json({ error: "That prediction has already finished." });
                return;
            }
            else if (err instanceof user_1.InvalidDirection) {
                res.status(400).json({ error: "Invalid direction provided" });
                return;
            }
            else {
                throw err;
            }
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
});
app.listen(3000, function () {
    console.log("App started");
});
