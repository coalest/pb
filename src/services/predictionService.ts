import axios from "axios";
import { User } from "../shared.types.ts";
import { API_CONFIG } from "../config/api";

import { PredictionDirection } from "../shared.types.ts";

export const predictionService = {
  placePrediction: async (
    userId: string,
    direction: PredictionDirection,
  ): Promise<User> => {
    try {
      const response = await axios.post<User>(
        `${API_CONFIG.PLACE_PREDICTION_ENDPOINT}/place`,
        {
          userId: userId,
          direction: direction,
        },
      );
      const user = response.data;

      return user;
    } catch (err) {
      throw new Error("Failed to place user " + (err as Error).message);
    }
  },
};
