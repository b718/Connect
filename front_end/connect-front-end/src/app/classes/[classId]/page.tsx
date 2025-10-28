import React from "react";
import Sidebar from "@/app/_shared/Sidebar";
import MainScreen from "@/app/_shared/MainScreen";
import styles from "./page.module.css";
import DisplayClassInformation from "./_components/DisplayClassInformation";

const page = () => {
  return (
    <div className={styles.PageContainer}>
      <Sidebar />
      <MainScreen component={<DisplayClassInformation />} />
    </div>
  );
};

export default page;
