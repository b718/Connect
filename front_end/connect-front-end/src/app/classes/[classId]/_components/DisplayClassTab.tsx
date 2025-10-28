import React, { FC } from "react";
import { Tab } from "./DisplayClassInformation";
import styles from "../page.module.css";

type DisplayClassTabProps = {
  activeTabValue: string;
  tabValue: Tab;
  tabDisplayValue: string;
  count?: number;
  setTabValue: React.Dispatch<React.SetStateAction<Tab>>;
};

const DisplayClassTab: FC<DisplayClassTabProps> = ({
  activeTabValue,
  tabValue,
  tabDisplayValue,
  count,
  setTabValue,
}) => {
  return (
    <div
      className={`${styles.Tab} ${
        activeTabValue === tabValue ? styles.ActiveTab : ""
      }`}
      onClick={() => setTabValue(tabValue)}
    >
      {tabDisplayValue} {count ? `(${count})` : ""}
    </div>
  );
};

export default DisplayClassTab;
