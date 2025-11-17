"use client";

import { useAuth } from "@clerk/nextjs";
import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { getUserId } from "./_utilities/getUserId";
import styles from "./UserIdContext.module.css";

interface UserIdContextType {
  userId: string;
}

interface UserIdContextProps {
  children: ReactNode;
}

export const UserIdContext = createContext<UserIdContextType>({
  userId: "",
});

export const UserIdContextProvider: FC<UserIdContextProps> = ({ children }) => {
  const { getToken, isLoaded } = useAuth();
  const [userId, setUserId] = useState<string>("");
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(true);
  const userIdContextValue: UserIdContextType = {
    userId: userId,
  };

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const userId = localStorage.getItem("userId");
    if (userId) {
      setUserId(userId);
      setLoading(false);
      return;
    }

    getUserId(getToken)
      .then((userId) => {
        setUserId(userId);
        localStorage.setItem("userId", userId);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [getToken, isLoaded]);

  if (error) {
    return (
      <div
        className={styles.PageNonContentContainer}
      >{`Error occured while signing in: ${error.message}`}</div>
    );
  }

  if (loading) {
    return <div className={styles.PageNonContentContainer}>Loading...</div>;
  }

  return (
    <UserIdContext.Provider value={userIdContextValue}>
      {children}
    </UserIdContext.Provider>
  );
};
