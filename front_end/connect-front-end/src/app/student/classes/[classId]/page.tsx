import React from "react";
import styles from "./page.module.css";
import Sidebar from "@/app/_shared/Sidebar";
import MainScreen from "@/app/_shared/MainScreen";
import DisplayStudentClassInformation from "./_components/DisplayStudentClassInformation";

const page = () => {
  return (
    <div className={styles.PageContainer}>
      <Sidebar />
      <MainScreen component={<DisplayStudentClassInformation />} />
    </div>
  );
};

export default page;
