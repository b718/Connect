"use client";

import React, { FC, ReactElement } from "react";
import styles from "./MainScreen.module.css";

interface MainScreenProps {
  component: ReactElement;
}

const MainScreen: FC<MainScreenProps> = ({ component }) => {
  return <div className={styles.MainScreenContainer}>{component}</div>;
};

export default MainScreen;
