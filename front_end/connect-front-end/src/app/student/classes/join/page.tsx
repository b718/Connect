import React from "react";
import styles from "./page.module.css";
import Sidebar from "@/app/_shared/Sidebar";
import MainScreen from "@/app/_shared/MainScreen";
import DisplayAllClassOptions from "./_components/DisplayAllClassOptions";

const page = () => {
  return (
    <div className={styles.PageContainer}>
      <Sidebar />
      <MainScreen component={<DisplayAllClassOptions />} />
    </div>
  );
};

export default page;
