import React from "react";
import Sidebar from "@/app/_shared/side-bar/Sidebar";
import MainScreen from "@/app/_shared/main-screen/MainScreen";
import DisplayCreateNewClassForm from "./_components/DisplayCreateNewClassForm";
import styles from "./page.module.css";

const page = () => {
  return (
    <div className={styles.PageContainer}>
      <Sidebar />
      <MainScreen component={<DisplayCreateNewClassForm />} />
    </div>
  );
};

export default page;
