"use client";

import React, { useEffect, useState } from "react";
import {
  Class,
  fetchStudentClasses,
} from "../_utilities/fetch-student-classes/fetchStudentClasses";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

const DisplayStudentClasses = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [studentClasses, setStudentClasses] = useState<Class[]>([]);
  const [error, setError] = useState<Error>();

  const redirectToSpecificClass = (classId: string) => {
    router.push("/student/classes/" + classId);
  };

  useEffect(() => {
    fetchStudentClasses(getToken)
      .then((studentClasses) => setStudentClasses(studentClasses))
      .catch((error) => setError(error));
  }, []);

  if (error) {
    return (
      <div>{`an error occured while fetching the student classes: ${error.message}`}</div>
    );
  }

  return (
    <div className={styles.StudentClassesContainer}>
      {studentClasses.map((studentClass) => (
        <div
          key={studentClass.classId}
          className={styles.StudentClassesIndividualContainer}
          onClick={() => redirectToSpecificClass(studentClass.classId)}
        >
          <div>{studentClass.courseName}</div>
          <div>Grade: {studentClass.studentGradeYear}</div>
          <div>{new Date(studentClass.createdAt).toDateString()}</div>
        </div>
      ))}
    </div>
  );
};

export default DisplayStudentClasses;
