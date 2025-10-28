"use client";

import React, { useEffect, useState } from "react";
import {
  ClassInformation,
  defaultClassInformation,
  fetchClass,
} from "../_utilities/fetchClass";
import { useParams } from "next/navigation";
import styles from "../page.module.css";
import DisplayStudentsInformation from "./DisplayStudentsInformation";
import DisplayTeachersInformation from "./DisplayTeachersInformation";
import DisplayClassTab from "./DisplayClassTab";

const TEACHERS = "Teachers";
const STUDENTS = "Students";
const OVERVIEW = "Overview";

export type Tab = "Students" | "Teachers" | "Overview";

const DisplayClassInformation = () => {
  const params = useParams();
  const [classInformation, setClassInformation] = useState<ClassInformation>(
    defaultClassInformation
  );
  const [error, setError] = useState<Error>();
  const [activeTab, setActiveTab] = useState<Tab>("Students");

  useEffect(() => {
    fetchClass(params.classId as string)
      .then((classInformation) => {
        setClassInformation(classInformation);
      })
      .catch((error) => {
        setError(error);
      });
  }, [params.classId]);

  if (error) {
    return (
      <div className={styles.DisplayClassInformationContainer}>
        {"Error loading class, please try again"}
      </div>
    );
  }

  if (classInformation === defaultClassInformation) {
    return (
      <div className={styles.DisplayClassInformationContainer}>
        {"Loading..."}
      </div>
    );
  }

  return (
    <div className={styles.DisplayClassInformationContainer}>
      <h1>{classInformation.courseName}</h1>
      <p>Grade: {classInformation.studentGradeYear}</p>

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
      </div>

      <div className={styles.TabContent}>
        {activeTab === STUDENTS && (
          <DisplayStudentsInformation students={classInformation.students} />
        )}
        {activeTab === TEACHERS && (
          <DisplayTeachersInformation teachers={classInformation.teachers} />
        )}
      </div>
    </div>
  );
};

export default DisplayClassInformation;
