import React from "react";
import styles from "./page.module.css";
import Sidebar from "../../../../../../_shared/Sidebar";
import MainScreen from "../../../../../../_shared/MainScreen";
import UploadStudentTest from "./_components/UploadStudentTest";

const page = () => {
  return (
    <div className={styles.PageContainer}>
      <Sidebar />
      <MainScreen component={<UploadStudentTest />} />
    </div>
  );
};

export default page;
