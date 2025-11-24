"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DisplayStudentsInformation from "./students/DisplayStudentsInformation";
import DisplayTeachersInformation from "./teachers/DisplayTeachersInformation";
import {
  ClassInformation,
  fetchClass,
} from "../_utilities/fetch-class/fetchClass";
import DisplayCreateTestInformation from "./create-test/DisplayCreateTestInformation";
import DisplayClassOverviewInformation from "./class-overview-information/DisplayClassOverviewInformation";
import styles from "../page.module.css";
import DisplayClassTab from "./class-information-tabs/DisplayClassTab";
import { fetchClassGrades } from "../_utilities/fetch-class-grades/fetchClassGrades";
import { CategorizedClassGrades } from "../_utilities/fetch-class-grades/groupGradesByStudent";

export type Tab = "Students" | "Teachers" | "Overview" | "Create Test";

const DisplayClassInformation = () => {
  const params = useParams();
  const classId = params.classId as string;
  const [classInformation, setClassInformation] = useState<ClassInformation>();
  const [classGrades, setClassGrades] = useState<CategorizedClassGrades>();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [error, setError] = useState<Error>();

  useEffect(() => {
    Promise.all([fetchClass(classId), fetchClassGrades(classId)])
      .then(([classInformation, grades]) => {
        setClassInformation(classInformation);
        setClassGrades(grades);
      })
      .catch((error) => setError(error));
  }, [classId]);

  if (error) {
    return (
      <div className={styles.PageNonContentContainer}>
        {"Error loading class, please try again"}
      </div>
    );
  }

  if (!classInformation || !classGrades) {
    return <div className={styles.PageNonContentContainer}>{"Loading..."}</div>;
  }

  return (
    <div className={styles.ClassInformationContainer}>
      <h1 className={styles.ClassInformationHeader}>
        {`${classInformation.courseName}`}
      </h1>

      <div className={styles.TabContainer}>
        <DisplayClassTab
          activeTabValue={activeTab}
          tabValue={"Overview"}
          tabDisplayValue={"Overview"}
          setTabValue={setActiveTab}
        />
        <DisplayClassTab
          activeTabValue={activeTab}
          tabValue={"Students"}
          tabDisplayValue={"Students"}
          count={classInformation?.students.length}
          setTabValue={setActiveTab}
        />
        <DisplayClassTab
          activeTabValue={activeTab}
          tabValue={"Teachers"}
          tabDisplayValue={"Teachers"}
          count={classInformation?.teachers.length}
          setTabValue={setActiveTab}
        />
        <DisplayClassTab
          activeTabValue={activeTab}
          tabValue={"Create Test"}
          tabDisplayValue={"Create Test"}
          setTabValue={setActiveTab}
        />
      </div>

      <div className={styles.TabContent}>
        {activeTab === "Overview" && (
          <DisplayClassOverviewInformation
            classGrades={classGrades}
            classId={classId}
          />
        )}
        {activeTab === "Students" && (
          <DisplayStudentsInformation students={classInformation.students} />
        )}
        {activeTab === "Teachers" && (
          <DisplayTeachersInformation teachers={classInformation.teachers} />
        )}
        {activeTab === "Create Test" && (
          <DisplayCreateTestInformation classId={classId} />
        )}
      </div>
    </div>
  );
};

export default DisplayClassInformation;
