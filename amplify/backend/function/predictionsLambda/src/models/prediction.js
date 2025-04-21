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
const crypto = require("crypto");

let tableName = "usersTable";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + "-" + process.env.ENV;
}

class PredictionAlreadyClosed extends Error {
  constructor(message) {
    super(message);
    this.name = "PredictionAlreadyClosed";
  }
}

class Prediction {
  // default prediction duration is 60 seconds
  static DEFAULT_DURATION_IN_SECONDS = 60;
  static DIRECTIONS = { UP: "up", DOWN: "down" };
  static STATUSES = { WON: "won", LOST: "lost" };

  constructor({
    id,
    direction,
    startPrice,
    startTime,
    finishTime,
    finalPrice,
    status,
  }) {
    this.id = id || crypto.randomUUID();
    this.direction = direction;
    this.startTime = startTime;
    this.finishTime = finishTime;
    this.startPrice = startPrice;
    this.finalPrice = finalPrice || null;
    this.status = status || null;
  }

  close(finalPrice) {
    if (this.finalPrice) {
      throw new PredictionAlreadyClosed();
    }

    this.finalPrice = finalPrice;

    (this.finalPrice > this.startPrice &&
      this.direction == this.constructor.DIRECTIONS.UP) ||
    (this.startPrice > this.finalPrice &&
      this.direction == this.constructor.DIRECTIONS.DOWN)
      ? (this.status = this.constructor.STATUSES.WON)
      : (this.status = this.constructor.STATUSES.LOST);

    return this;
  }

  toJSON() {
    return {
      direction: this.direction,
      startPrice: this.startPrice,
      startTime: this.startTime,
      finishTime: this.finishTime,
      finalPrice: this.finalPrice,
      status: this.status,
      id: this.id,
    };
  }
}

module.exports = { Prediction, PredictionAlreadyClosed };
