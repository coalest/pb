"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prediction = exports.PredictionAlreadyClosed = void 0;
const crypto_1 = __importDefault(require("crypto"));
class PredictionAlreadyClosed extends Error {
    constructor(message) {
        super(message);
        this.name = "PredictionAlreadyClosed";
    }
}
exports.PredictionAlreadyClosed = PredictionAlreadyClosed;
class Prediction {
    constructor({ id, direction, startPrice, finalPrice, startTime, finishTime, status, }) {
        this.id = id ?? crypto_1.default.randomUUID();
        this.direction = direction;
        this.startTime = startTime;
        this.finishTime = finishTime;
        this.startPrice = startPrice;
        this.finalPrice = finalPrice ?? null;
        this.status = status ?? null;
    }
    close(finalPrice) {
        if (this.finalPrice)
            throw new PredictionAlreadyClosed();
        this.finalPrice = finalPrice;
        if (this.isWinningResult(this.startPrice, this.finalPrice, this.direction)) {
            this.status = Prediction.STATUSES.WON;
        }
        else {
            this.status = Prediction.STATUSES.LOST;
        }
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
    isWinningResult(startPrice, finalPrice, direction) {
        return ((finalPrice > startPrice && direction == Prediction.DIRECTIONS.UP) ||
            (startPrice > finalPrice && direction == Prediction.DIRECTIONS.DOWN));
    }
}
exports.Prediction = Prediction;
Prediction.DEFAULT_DURATION_IN_SECONDS = 60;
Prediction.DIRECTIONS = { UP: "up", DOWN: "down" };
Prediction.STATUSES = { WON: "won", LOST: "lost" };
