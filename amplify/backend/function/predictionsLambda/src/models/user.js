const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  convertClassInstanceToMap: true,
});

let tableName = "usersTable";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + "-" + process.env.ENV;
}

const { Prediction } = require("./prediction");

class UserNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = "UserNotFound";
  }
}

class PredictionInProgress extends Error {
  constructor(message) {
    super(message);
    this.name = "PredictionInProgress";
  }
}

class InvalidDirection extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidDirection";
  }
}

class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.predictions = Array.isArray(data.predictions) ? data.predictions : [];
    this.score = data.score || 0;

    // TODO: Use an ORM or something here.
    for (const key in data) {
      if (!this.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

  getLastPrediction() {
    return new Prediction(this.predictions[this.predictions.length - 1]);
  }

  async closeLastPrediction(prediction) {
    prediction.status == Prediction.STATUSES.WON ? this.score++ : this.score--;

    this.predictions[this.predictions.length - 1] = prediction.toJSON();

    return await this.save();
  }

  static async findById(id) {
    const params = {
      TableName: tableName,
      Key: { id },
    };

    try {
      const { Item } = await ddbDocClient.send(new GetCommand(params));
      if (!Item) throw new UserNotFound();
      return new User(Item);
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  }

  async predict(direction, duration) {
    // If any of the user's predictions don't have a final price, don't allow a new prediction.
    if (this.predictions.some((prediction) => !prediction.finalPrice)) {
      throw new PredictionInProgress();
    }

    if (!Object.values(Prediction.DIRECTIONS).includes(direction)) {
      throw new InvalidDirection();
    }

    const startTime = Date.now();
    const finishTime =
      startTime + (duration || Prediction.DEFAULT_DURATION_IN_SECONDS);
    const startPrice = 80_234_00;

    const newPrediction = new Prediction({
      direction,
      startPrice,
      startTime,
      finishTime,
    });

    this.predictions.push(newPrediction.toJSON());
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

module.exports = {
  User,
  UserNotFound,
  PredictionInProgress,
  InvalidDirection,
};
