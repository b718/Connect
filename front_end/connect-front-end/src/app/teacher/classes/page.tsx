import React from "react";
import Sidebar from "@/app/_shared/side-bar/Sidebar";
import MainScreen from "@/app/_shared/main-screen/MainScreen";
import DisplayTeacherClasses from "./_components/DisplayTeacherClasses";
import styles from "./page.module.css";

const page = () => {
  return (
    <div className={styles.PageContainer}>
      <Sidebar />
      <MainScreen component={<DisplayTeacherClasses />} />
    </div>
  );
};

export default page;
