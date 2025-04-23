import React, { createContext, useState } from "react";
import { toast } from "react-toastify";

import {
  User,
  Prediction,
  PredictionDirection,
  PredictionStatus,
} from "../shared.types";

import { predictionService } from "../services/predictionService";
import { userService } from "../services/userService";

type GameContextType = {
  prediction: Prediction | null;
  lockedDirection: PredictionDirection;
  placeNewPrediction: (userId: string, direction: PredictionDirection) => void;
  closeRound: (userId: string) => void;
  countdownKey: number;
  isCountingDown: boolean;
  isLoading: boolean;
  error: string | null;
  predictionResult: PredictionStatus;
  userScore: number | null;
};

export const GameContext = createContext<GameContextType | undefined>(
  undefined,
);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [countdownKey, setCountdownKey] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [lockedDirection, setLockedDirection] =
    useState<PredictionDirection>(null);
  const [predictionResult, setPredictionResult] =
    useState<PredictionStatus>(null);
  const [userScore, setUserScore] = useState<number | null>(null);

  const resetGame = () => {
    setCountdownKey(countdownKey + 1);
    setIsCountingDown(false);
    setPredictionResult(null);
    setLockedDirection(null);
  };

  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const placeNewPrediction = async (
    userId: string,
    direction: PredictionDirection,
  ) => {
    if (!direction) {
      toast("Please select a direction first!");
      return;
    }
    setIsLoading(true);
    setError(null);

    setLockedDirection(direction);
    setCountdownKey(countdownKey + 1);
    setIsCountingDown(true);

    try {
      const user = await predictionService.placePrediction(userId, direction);
      const lastPrediction = user.predictions[user.predictions.length - 1];

      setPrediction(lastPrediction);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error("API request error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchResults = async (userId: string) => {
    try {
      const user: User = await userService.fetchUser(userId);
      const lastPrediction: Prediction =
        user.predictions[user.predictions.length - 1];

      setUserScore(user.score);
      setIsLoading(false);
      setPrediction(lastPrediction);
      setPredictionResult(lastPrediction.status);
      setIsCountingDown(false);
      setTimeout(resetGame, 3000);
      toast(`You ${lastPrediction.status}!`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error("API request error:", err);
    }
  };
  const closeRound = async (userId: string) => {
    setIsLoading(true);
    setTimeout(() => fetchResults(userId), 1000);
  };

  return (
    <GameContext.Provider
      value={{
        isCountingDown,
        countdownKey,
        lockedDirection,
        placeNewPrediction,
        prediction,
        isLoading,
        error,
        closeRound,
        predictionResult,
        userScore,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
