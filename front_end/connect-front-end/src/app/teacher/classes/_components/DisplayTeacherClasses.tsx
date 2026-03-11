"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import {
  Class,
  fetchTeacherClasses,
} from "../_utilites/fetch-teacher-classes/fetchTeacherClasses";
import { useAuth } from "@clerk/nextjs";

const DisplayTeacherClasses = () => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();
  const redirectToSpecificClass = (classId: string) => {
    router.push("/teacher/classes/" + classId);
  };
  const redirectToCreateClassMenu = () => {
    router.push("/teacher/classes/create");
  };

  useEffect(() => {
    fetchTeacherClasses(getToken)
      .then((data) => setClasses(data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.PageNonContentContainer}>{"Loading ..."}</div>
    );
  }

  if (error) {
    return (
      <div className={styles.PageNonContentContainer}>
        {"failed to fetch classes"}
      </div>
    );
  }

  return (
    <div className={styles.DisplayClassesContainer}>
      {classes.map((teacherClass) => (
        <div
          key={teacherClass.classId}
          className={styles.IndividualClassContainer}
          onClick={() => redirectToSpecificClass(teacherClass.classId)}
        >
          <div>{teacherClass.courseName}</div>
          <div>Grade: {teacherClass.studentGradeYear}</div>
          <div>{new Date(teacherClass.createdAt).toDateString()}</div>
        </div>
      ))}
      <div
        className={styles.CreateClassContainer}
        onClick={redirectToCreateClassMenu}
      >
        Create a new class
      </div>
    </div>
  );
};

export default DisplayTeacherClasses;
