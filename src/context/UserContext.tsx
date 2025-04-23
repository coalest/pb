import React, { useState, useEffect } from "react";
import { User } from "../shared.types.ts";
import { API_CONFIG } from "../config/api";
import { userService } from "../services/userService";

export type UserContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateUser?: (userData: User) => void;
};

export const UserContext = React.createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);

        // Check if UUID exists in localStorage
        const storedId: string | null = localStorage.getItem(
          API_CONFIG.STORAGE_KEY,
        );

        let userData: User;

        if (storedId) {
          userData = await userService.fetchUser(storedId);
          console.log("user fetched: " + userData);
        } else {
          // No UUID found, create a new user
          userData = await userService.createUser();
          console.log("user created: " + userData);
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
