import { useState, useEffect, createContext } from "react";
import type { FC, ReactNode } from "react";

import { toast } from "react-toastify";

import { User, Prediction, PredictionDirection } from "../shared.types";

import { predictionService } from "../services/predictionService";
import { userService } from "../services/userService";
import { API_CONFIG } from "../config/api";

type GameContextType = {
  user: User | null;
  prediction: Prediction | null;
  lockedDirection: boolean;
  placeNewPrediction: (userId: string, direction: PredictionDirection) => void;
  closeRound: (userId: string) => void;
  countdownKey: number;
  isCountingDown: boolean;
  isLoading: boolean;
  error: string | null;
  timeLeft: number;
  currentDirection: PredictionDirection | null;
  updateCurrentDirection: (direction: PredictionDirection) => void;
};

export const GameContext = createContext<GameContextType | undefined>(
  undefined,
);

export const GameProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [countdownKey, setCountdownKey] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lockedDirection, setLockedDirection] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDirection, setCurrentDirection] =
    useState<PredictionDirection | null>(null);

  const updateUser = (userData: User) => setUser(userData);
  const updateCurrentDirection = (direction: PredictionDirection) =>
    setCurrentDirection(direction);

  const isInProgress = (prediction: Prediction | null) =>
    prediction && prediction.finishTime > Date.now();

  const initializePrevGameState = (prediction: Prediction) => {
    const currentTime = Date.now();
    const secondsLeft = (prediction.finishTime - currentTime) / 1000;
    const prevDirection = prediction.direction;

    setIsCountingDown(true);
    setLockedDirection(true);
    setCurrentDirection(prevDirection);
    setPrediction(prediction);
    setTimeLeft(Math.floor(secondsLeft));
  };

  // Fetch user from localStorage or create one and store in localStorage
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const storedId: string | null = localStorage.getItem(
          API_CONFIG.STORAGE_KEY,
        );

        let userData: User;

        if (storedId) {
          userData = await userService.fetchUser(storedId);
          const lastPrediction =
            userData.predictions[userData.predictions.length - 1] ?? 0;
          if (isInProgress(lastPrediction)) {
            initializePrevGameState(lastPrediction);
          }
        } else {
          userData = await userService.createUser();
        }

        setUser(userData);
      } catch (err) {
        console.error(err);
        setUser(null);
      }
    };

    initializeUser();
  }, []);

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
    setLockedDirection(true);

    try {
      const user = await predictionService.placePrediction(userId, direction);
      const lastPrediction = user.predictions[user.predictions.length - 1];

      setPrediction(lastPrediction);

      setCountdownKey(countdownKey + 1);
      setIsCountingDown(true);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
      setLockedDirection(false);
      console.error("API request error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const resetGame = () => {
    setCountdownKey(countdownKey + 1);
    setIsCountingDown(false);
    setLockedDirection(false);
    setCurrentDirection(null);
    setPrediction(null);
  };
  const fetchResults = async (userId: string) => {
    try {
      const user: User = await userService.fetchUser(userId);
      const lastPrediction: Prediction =
        user.predictions[user.predictions.length - 1];

      updateUser?.(user);
      setIsLoading(false);
      setIsCountingDown(false);
      setTimeLeft(60);
      setPrediction(lastPrediction);
      setTimeout(resetGame, 3000);
      if (lastPrediction.status) toast(`You ${lastPrediction.status}!`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error("API request error:", err);
    }
  };
  const closeRound = async (userId: string) => {
    setIsLoading(true);
    setTimeout(() => fetchResults(userId), 3000);
  };

  return (
    <GameContext.Provider
      value={{
        user,
        isCountingDown,
        countdownKey,
        lockedDirection,
        currentDirection,
        updateCurrentDirection,
        placeNewPrediction,
        prediction,
        isLoading,
        error,
        closeRound,
        timeLeft,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
