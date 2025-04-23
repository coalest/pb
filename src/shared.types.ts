export type Prediction = {
  id: string;
  direction: "up" | "down";
  startTime: number;
  finishTime: number;
  startPrice: number;
  finalPrice?: number;
  status: "won" | "lost" | null;
};
export type User = {
  id: string;
  score: number;
  predictions: Prediction[];
};
export type PredictionDirection = "up" | "down" | null;
export type PredictionStatus = "won" | "lost" | null;
