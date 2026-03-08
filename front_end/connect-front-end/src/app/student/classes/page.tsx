import React from "react";
import styles from "./page.module.css";
import Sidebar from "@/app/_shared/side-bar/Sidebar";
import MainScreen from "@/app/_shared/main-screen/MainScreen";
import DisplayStudentClasses from "./_components/DisplayStudentClasses";
import { Group, Panel } from "react-resizable-panels";

const page = () => {
  // return (
  //   <div className={styles.PageContainer}>
  //     <Sidebar />

  //     <MainScreen component={<DisplayStudentClasses />} />
  //   </div>

  return (
    <Group>
      <Panel defaultSize={"20%"} minSize={"20%"}>
        <Sidebar />
      </Panel>
      <Panel>
        <MainScreen component={<DisplayStudentClasses />} />
      </Panel>
    </Group>
  );
};

export default page;
