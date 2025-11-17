import React from "react";
import styles from "./page.module.css";
import Sidebar from "@/app/_shared/Sidebar";
import MainScreen from "@/app/_shared/MainScreen";
import DisplayStudentClasses from "./_components/DisplayStudentClasses";

const page = () => {
  return (
    <div className={styles.PageContainer}>
      <Sidebar />
      <MainScreen component={<DisplayStudentClasses />} />
    </div>
  );
};

export default page;
