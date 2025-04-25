import crypto from "crypto";

export class PredictionAlreadyClosed extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "PredictionAlreadyClosed";
  }
}

export class Prediction {
  static DEFAULT_DURATION_IN_SECONDS = 60;
  static DIRECTIONS = { UP: "up", DOWN: "down" };
  static STATUSES = { WON: "won", LOST: "lost" };

  public direction: string;
  public startPrice: number;
  public startTime: number;
  public finishTime: number;
  public id?: string;
  public finalPrice?: number;
  public status?: string;

  constructor({
    id,
    direction,
    startPrice,
    finalPrice,
    startTime,
    finishTime,
    status,
  }: {
    id?: string;
    direction: string;
    startPrice: number;
    finalPrice?: number;
    startTime: number;
    finishTime: number;
    status?: string;
  }) {
    this.id = id ?? crypto.randomUUID();
    this.direction = direction;
    this.startTime = startTime;
    this.finishTime = finishTime;
    this.startPrice = startPrice;
    this.finalPrice = finalPrice ?? null;
    this.status = status ?? null;
  }

  close(finalPrice: number) {
    if (this.finalPrice) throw new PredictionAlreadyClosed();

    this.finalPrice = finalPrice;

    if (
      this.isWinningResult(this.startPrice, this.finalPrice, this.direction)
    ) {
      this.status = Prediction.STATUSES.WON;
    } else {
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

  private isWinningResult(
    startPrice: number,
    finalPrice: number,
    direction: string,
  ) {
    return (
      (finalPrice > startPrice && direction == Prediction.DIRECTIONS.UP) ||
      (startPrice > finalPrice && direction == Prediction.DIRECTIONS.DOWN)
    );
  }
}
