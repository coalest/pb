export type Prediction = {
  id: string;
  direction: "up" | "down";
  startTime: number;
  finishTime: number;
  startPrice: number;
  finalPrice?: number;
  status?: "won" | "lost";
};
export type User = {
  id: string;
  score: number;
  predictions: Prediction[];
};
