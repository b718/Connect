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

const TEACHERS = "Teachers";
const STUDENTS = "Students";
const OVERVIEW = "Overview";
const CREATE_TEST = "Create Test";

export type Tab = "Students" | "Teachers" | "Overview" | "Create Test";

const DisplayClassInformation = () => {
  const params = useParams();
  const classId = params.classId as string;
  const [classInformation, setClassInformation] = useState<ClassInformation>();
  const [studentGrades, setStudentGrades] = useState<CategorizedTests>();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [error, setError] = useState<Error>();

  useEffect(() => {
    Promise.all([fetchClass(classId), fetchStudentGrades(classId)])
      .then((results) => {
        setClassInformation(results[0]);
        setStudentGrades(results[1]);
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

  return (
    <div className={styles.DisplayClassInformationContainer}>
      <h1 className={styles.DisplayClassInformationHeader}>
        {`${classInformation.courseName}`}
      </h1>

      <div className={styles.TabContainer}>
        <DisplayClassTab
          activeTabValue={activeTab}
          tabValue={OVERVIEW}
          tabDisplayValue={OVERVIEW}
          setTabValue={setActiveTab}
        />
        <DisplayClassTab
          activeTabValue={activeTab}
          tabValue={STUDENTS}
          tabDisplayValue={STUDENTS}
          count={classInformation.students.length}
          setTabValue={setActiveTab}
        />
        <DisplayClassTab
          activeTabValue={activeTab}
          tabValue={TEACHERS}
          tabDisplayValue={TEACHERS}
          count={classInformation.teachers.length}
          setTabValue={setActiveTab}
        />
        <DisplayClassTab
          activeTabValue={activeTab}
          tabValue={CREATE_TEST}
          tabDisplayValue={CREATE_TEST}
          setTabValue={setActiveTab}
        />
      </div>

      <div className={styles.TabContent}>
        {activeTab === OVERVIEW && (
          <DisplayClassOverviewInformation
            studentGrades={studentGrades}
            classId={classId}
          />
        )}
        {activeTab === STUDENTS && (
          <DisplayStudentsInformation students={classInformation.students} />
        )}
        {activeTab === TEACHERS && (
          <DisplayTeachersInformation teachers={classInformation.teachers} />
        )}
        {activeTab === CREATE_TEST && (
          <DisplayCreateTestInformation classId={classId} />
        )}
      </div>
    </div>
  );
};

export default DisplayClassInformation;
