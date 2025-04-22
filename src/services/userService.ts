import axios from "axios";
import { User } from "../shared.types.ts";
import { API_CONFIG } from "../config/api";

export const userService = {
  createUser: async (): Promise<User> => {
    try {
      const response = await axios.post<User>(API_CONFIG.USERS_ENDPOINT);
      const newUser = response.data;

      localStorage.setItem(API_CONFIG.STORAGE_KEY, newUser.id);

      return newUser;
    } catch (err) {
      throw new Error("Failed to create user " + (err as Error).message);
    }
  },

  fetchUser: async (id: string): Promise<User> => {
    try {
      const response = await axios.get<User>(
        `${API_CONFIG.USERS_ENDPOINT}/${id}`,
      );
      return response.data;
    } catch (err) {
      throw new Error("Failed to fetch user " + (err as Error).message);
    }
  },
};
