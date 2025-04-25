import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { Prediction } from "./prediction";

const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { convertClassInstanceToMap: true },
});

let tableName = "usersTable";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + "-" + process.env.ENV;
}

class UserNotFound extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "UserNotFound";
  }
}

class PredictionInProgress extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "PredictionInProgress";
  }
}

class InvalidDirection extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "InvalidDirection";
  }
}

class User {
  constructor(
    public id: string,
    public predictions: Prediction[],
    public score?: number,
  ) {
    this.id = id || null;
    this.predictions = predictions;
    this.score = score ?? 0;
  }

  getLastPrediction() {
    return new Prediction(this.predictions[this.predictions.length - 1]);
  }

  async closeLastPrediction(prediction: Prediction) {
    if (prediction.status == Prediction.STATUSES.WON) {
      this.score++;
    } else {
      this.score--;
    }

    this.predictions[this.predictions.length - 1] = prediction;

    return await this.save();
  }

  static async findById(id: string) {
    const params = {
      TableName: tableName,
      Key: { id },
    };

    try {
      const { Item } = await ddbDocClient.send(new GetCommand(params));
      if (!Item) throw new UserNotFound();
      return new User(Item.id, Item.predictions, Item.score);
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  }

  async predict(startPrice: number, direction: string, duration: number) {
    // If any of the user's predictions don't have a final price, don't allow a new prediction.
    if (this.predictions.some((prediction) => !prediction.finalPrice)) {
      throw new PredictionInProgress();
    }

    // TODO: Move this logic to Prediction class
    if (!Object.values(Prediction.DIRECTIONS).includes(direction)) {
      throw new InvalidDirection();
    }

    const startTime = Date.now();
    const finishTime =
      startTime + (duration || Prediction.DEFAULT_DURATION_IN_SECONDS) * 1000;

    const newPrediction = new Prediction({
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
      await ddbDocClient.send(new PutCommand(params));
      return this;
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  }
}

export { User, UserNotFound, PredictionInProgress, InvalidDirection };
