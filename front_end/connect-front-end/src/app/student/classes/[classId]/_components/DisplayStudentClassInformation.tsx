"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Class,
  fetchStudentClass,
} from "../_utilites/fetch-student-class/fetchStudentClass";
import {
  fetchStudentGrades,
  StudentGrade,
} from "../_utilites/fetch-student-grades/fetchStudentGrades";
import { useAuth } from "@clerk/nextjs";
import DisplayStudentClassGrades from "./DisplayStudentClassGrades";
import styles from "../page.module.css";

const DisplayStudentClassInformation = () => {
  const params = useParams();
  const classId = params.classId as string;
  const { getToken } = useAuth();
  const [studentClass, setStudentClass] = useState<Class>();
  const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([]);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    Promise.all([
      fetchStudentClass(getToken, classId),
      fetchStudentGrades(getToken, classId),
    ])
      .then(([studentClass, studentGrades]) => {
        setStudentClass(studentClass);
        setStudentGrades(studentGrades);
      })
      .catch((error) => setError(error));
  }, [classId]);

  if (error) {
    <div
      className={styles.PageNonContentContainer}
    >{`Error encountered while fetching information for the class: ${error.message}`}</div>;
  }

  if (!studentClass) {
    return <div className={styles.PageNonContentContainer}>Loading...</div>;
  }

  return (
    <div className={styles.StudentClassInformationContainer}>
      <h1 className={styles.StudentClassInformationHeader}>
        {studentClass.courseName}
      </h1>
      <div className={styles.StudentClassGradesContainer}>
        <DisplayStudentClassGrades
          studentGrades={studentGrades}
          classId={classId}
        />
      </div>
    </div>
  );
};

export default DisplayStudentClassInformation;
