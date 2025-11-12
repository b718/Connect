"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "../page.module.css";
import DisplayStudentsInformation from "./students/DisplayStudentsInformation";
import DisplayTeachersInformation from "./teachers/DisplayTeachersInformation";
import DisplayClassTab from "./DisplayClassTab";
import { fetchStudentGrades } from "../_utilities/fetch-student-grades-for-class/fetchStudentGradesForClass";
import { CategorizedTests } from "../_utilities/fetch-student-grades-for-class/categorizeTestsForStudents";
import {
  ClassInformation,
  fetchClass,
} from "../_utilities/fetch-class/fetchClass";
import DisplayCreateTestInformation from "./create-test/DisplayCreateTestInformation";
import DisplayClassOverviewInformation from "./class-overview-information/DisplayClassOverviewInformation";
export type Tab = "Students" | "Teachers" | "Overview" | "Create Test";

const DisplayClassInformation = () => {
  const params = useParams();
  const classId = params.classId as string;
  const [classInformation, setClassInformation] = useState<ClassInformation>();
  const [studentGrades, setStudentGrades] = useState<CategorizedTests>();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [error, setError] = useState<Error>();
  const TABS_CONFIG = [
    { value: "Overview", display: "Overview" },
    {
      value: "Students",
      display: "Students",
      count: classInformation?.students.length,
    },
    {
      value: "Teachers",
      display: "Teachers",
      count: classInformation?.teachers.length,
    },
    { value: "Create Test", display: "Create Test" },
  ];

  useEffect(() => {
    Promise.all([fetchClass(classId), fetchStudentGrades(classId)])
      .then(([classInformation, grades]) => {
        setClassInformation(classInformation);
        setStudentGrades(grades);
      })
      .catch((error) => setError(error));
  }, [classId]);

  if (error) {
    return (
      <div className={styles.DisplayClassLoadingErrorContainer}>
        {"Error loading class, please try again"}
      </div>
    );
  }

  if (!classInformation || !studentGrades) {
    return (
      <div className={styles.DisplayClassLoadingErrorContainer}>
        {"Loading..."}
      </div>
    );
  }

  const tabContent: Record<Tab, React.ReactNode> = {
    Overview: (
      <DisplayClassOverviewInformation
        studentGrades={studentGrades}
        classId={classId}
      />
    ),
    Students: (
      <DisplayStudentsInformation students={classInformation.students} />
    ),
    Teachers: (
      <DisplayTeachersInformation teachers={classInformation.teachers} />
    ),
    "Create Test": <DisplayCreateTestInformation classId={classId} />,
  };

  return (
    <div className={styles.DisplayClassInformationContainer}>
      <h1 className={styles.DisplayClassInformationHeader}>
        {`${classInformation.courseName}`}
      </h1>

      <div className={styles.DisplayClassInformationTabContainer}>
        {TABS_CONFIG.map((tab) => (
          <DisplayClassTab
            key={tab.value}
            activeTabValue={activeTab}
            tabValue={tab.value as Tab}
            tabDisplayValue={tab.display}
            count={tab.count}
            setTabValue={setActiveTab}
          />
        ))}
      </div>

      <div className={styles.TabContent}>{tabContent[activeTab]}</div>
    </div>
  );
};

export default DisplayClassInformation;
