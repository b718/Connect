import React from "react";
import MainScreen from "../_shared/MainScreen";
import Sidebar from "../_shared/Sidebar";
import styles from "./page.module.css";
import DisplayClasses from "./_components/DisplayClasses";

const page = () => {
  return (
    <div className={styles.PageContainer}>
      <Sidebar />
      <MainScreen component={<DisplayClasses />} />
    </div>
  );
};

export default page;
