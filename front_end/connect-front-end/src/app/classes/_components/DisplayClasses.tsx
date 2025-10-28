"use client";

import React, { useEffect, useState } from "react";
import { Class, fetchClasses } from "../_utilites/fetchClasses";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

const DisplayClasses = () => {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [error, setError] = useState<Error>();
  const redirectToSpecificClass = (classId: string) => {
    router.push("/classes/" + classId);
  };

  useEffect(() => {
    fetchClasses()
      .then((data) => {
        setClasses(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  if (error) {
    return (
      <div className={styles.MainScreenContainer}>
        {"something went wrong :(, please refresh"}
      </div>
    );
  }

  return (
    <div className={styles.DisplayClassesContainer}>
      {classes.map((teacherClass) => (
        <div
          key={teacherClass.classId}
          className={styles.DisplayClassesIndividualContainer}
          onClick={() => redirectToSpecificClass(teacherClass.classId)}
        >
          <div>{teacherClass.courseName}</div>
          <div>Grade: {teacherClass.studentGradeYear}</div>
          <div>{new Date(teacherClass.createdAt).toDateString()}</div>
        </div>
      ))}
    </div>
  );
};

export default DisplayClasses;
