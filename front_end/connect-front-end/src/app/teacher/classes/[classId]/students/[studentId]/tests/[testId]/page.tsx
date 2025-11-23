"use client";

import React from "react";
import Sidebar from "@/app/_shared/side-bar/Sidebar";
import MainScreen from "@/app/_shared/main-screen/MainScreen";
import UpdateStudentSubmission from "./_components/UpdateStudentSubmission";
import styles from "./page.module.css";

const page = () => {
  return (
    <div className={styles.PageContainer}>
      <Sidebar />
      <MainScreen component={<UpdateStudentSubmission />} />
    </div>
  );
};

export default page;
