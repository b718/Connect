import React from "react";
import MainScreen from "@/app/_shared/main-screen/MainScreen";
import Sidebar from "@/app/_shared/side-bar/Sidebar";
import ViewStudentSubmission from "./_components/ViewStudentSubmission";
import styles from "./page.module.css";

export const runtime = "edge";

const page = () => {
  return (
    <div className={styles.PageContainer}>
      <Sidebar />
      <MainScreen component={<ViewStudentSubmission />} />
    </div>
  );
};

export default page;
