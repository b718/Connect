import React from "react";
import Sidebar from "@/app/_shared/side-bar/Sidebar";
import MainScreen from "@/app/_shared/main-screen/MainScreen";
import DisplayClassInformation from "./_components/DisplayClassInformation";
import styles from "./page.module.css";

export const runtime = "edge";

const page = () => {
  return (
    <div className={styles.PageContainer}>
      <Sidebar />
      <MainScreen component={<DisplayClassInformation />} />
    </div>
  );
};

export default page;
