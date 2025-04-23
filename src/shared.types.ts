export enum PredictionDirection {
  UP = "up",
  DOWN = "down",
}
export enum PredictionStatus {
  WON = "won",
  LOST = "lost",
}
export type Prediction = {
  id: string;
  direction: PredictionDirection;
  startTime: number;
  finishTime: number;
  startPrice: number;
  finalPrice?: number;
  status: PredictionStatus | null;
};
export type User = {
  id: string;
  score: number;
  predictions: Prediction[];
};
