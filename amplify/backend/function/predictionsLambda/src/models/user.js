"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidDirection = exports.PredictionInProgress = exports.UserNotFound = exports.User = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const prediction_1 = require("./prediction");
const ddbClient = new client_dynamodb_1.DynamoDBClient({ region: process.env.REGION });
const ddbDocClient = lib_dynamodb_1.DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions: { convertClassInstanceToMap: true },
});
let tableName = "usersTable";
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + "-" + process.env.ENV;
}
class UserNotFound extends Error {
    constructor(message) {
        super(message);
        this.name = "UserNotFound";
    }
}
exports.UserNotFound = UserNotFound;
class PredictionInProgress extends Error {
    constructor(message) {
        super(message);
        this.name = "PredictionInProgress";
    }
}
exports.PredictionInProgress = PredictionInProgress;
class InvalidDirection extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidDirection";
    }
}
exports.InvalidDirection = InvalidDirection;
class User {
    constructor(id, predictions, score) {
        this.id = id;
        this.predictions = predictions;
        this.score = score;
        this.id = id || null;
        this.predictions = predictions;
        this.score = score ?? 0;
    }
    getLastPrediction() {
        return new prediction_1.Prediction(this.predictions[this.predictions.length - 1]);
    }
    async closeLastPrediction(prediction) {
        if (prediction.status == prediction_1.Prediction.STATUSES.WON) {
            this.score++;
        }
        else {
            this.score--;
        }
        this.predictions[this.predictions.length - 1] = prediction;
        return await this.save();
    }
    static async findById(id) {
        const params = {
            TableName: tableName,
            Key: { id },
        };
        try {
            const { Item } = await ddbDocClient.send(new lib_dynamodb_1.GetCommand(params));
            if (!Item)
                throw new UserNotFound();
            return new User(Item.id, Item.predictions, Item.score);
        }
        catch (error) {
            console.error("Error finding user:", error);
            throw error;
        }
    }
    async predict(startPrice, direction, duration) {
        // If any of the user's predictions don't have a final price, don't allow a new prediction.
        if (this.predictions.some((prediction) => !prediction.finalPrice)) {
            throw new PredictionInProgress();
        }
        // TODO: Move this logic to Prediction class
        if (!Object.values(prediction_1.Prediction.DIRECTIONS).includes(direction)) {
            throw new InvalidDirection();
        }
        const startTime = Date.now();
        const finishTime = startTime + (duration || prediction_1.Prediction.DEFAULT_DURATION_IN_SECONDS) * 1000;
        const newPrediction = new prediction_1.Prediction({
            direction: direction,
            startPrice: startPrice,
            startTime: startTime,
            finishTime: finishTime,
        });
        this.predictions.push(newPrediction);
        console.log(this);
        return await this.save();
    }
    async save() {
        const params = {
            TableName: tableName,
            Item: { ...this },
        };
        try {
            await ddbDocClient.send(new lib_dynamodb_1.PutCommand(params));
            return this;
        }
        catch (error) {
            console.error("Error saving user:", error);
            throw error;
        }
    }
}
exports.User = User;
