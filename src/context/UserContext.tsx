import { useState, useEffect, createContext } from "react";
import type { FC, ReactNode } from "react";
import { User } from "../shared.types.ts";
import { API_CONFIG } from "../config/api";
import { userService } from "../services/userService";

export type UserContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateUser?: (userData: User) => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
});

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  // Fetch user from localStorage or create one and store in localStorage
  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);

        const storedId: string | null = localStorage.getItem(
          API_CONFIG.STORAGE_KEY,
        );

        let userData: User;

        if (storedId) {
          userData = await userService.fetchUser(storedId);
        } else {
          userData = await userService.createUser();
        }

        setUser(userData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
