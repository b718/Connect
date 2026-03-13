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
  userIdLocalStorageKey: string;
}

interface UserIdContextProps {
  children: ReactNode;
}

export const UserIdContext = createContext<UserIdContextType>({
  userId: "",
  userIdLocalStorageKey: "",
});

export const UserIdContextProvider: FC<UserIdContextProps> = ({ children }) => {
  const { getToken, isLoaded, userId: clerkUserId } = useAuth();
  const [userId, setUserId] = useState<string>("");
  const [userIdLocalStorageKey, setUserIdLocalStorageKey] = useState<string>("");
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(true);
  const userIdContextValue: UserIdContextType = {
    userId: userId,
    userIdLocalStorageKey: userIdLocalStorageKey,
  };

  useEffect(() => {
    if (!isLoaded || !clerkUserId) {
      return;
    }

    const cacheKey = `connect_userId:${clerkUserId}`;
    const cachedUserId = localStorage.getItem(cacheKey);
    if (cachedUserId) {
      setUserId(cachedUserId);
      setUserIdLocalStorageKey(cacheKey);
      setLoading(false);
      return;
    }

    getUserId(getToken)
      .then((newUserId) => {
        setUserId(newUserId);
        setUserIdLocalStorageKey(cacheKey);
        localStorage.setItem(cacheKey, newUserId);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [getToken, isLoaded, clerkUserId]);

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
