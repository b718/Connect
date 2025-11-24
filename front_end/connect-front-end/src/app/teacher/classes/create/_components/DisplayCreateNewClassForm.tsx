"use client";

import React, { FormEvent, useState } from "react";
import styles from "../page.module.css";
import { createNewClass } from "../_utilities/create-new-class/createNewClass";
import { useAuth } from "@clerk/nextjs";

const DisplayCreateNewClassForm = () => {
  const { getToken } = useAuth();
  const [courseName, setCourseName] = useState<string>("");
  const [studentGradeYear, setStudentGradeYear] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [createdClass, setCreatedClass] = useState<boolean>(false);
  const handleCreateClassFormSubmission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (courseName.length == 0 || studentGradeYear.length == 0) {
      return;
    }

    setLoading(true);
    createNewClass(getToken, courseName, studentGradeYear)
      .then((createdClass) => setCreatedClass(createdClass))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  if (error) {
    return (
      <div className={styles.PageNonContentContainer}>
        {"Failed to create new class"}
      </div>
    );
  }

  if (createdClass) {
    return (
      <div className={styles.PageNonContentContainer}>
        {"Successfully create new class"}
      </div>
    );
  }

  return (
    <form
      className={styles.CreateNewClassFormContainer}
      onSubmit={handleCreateClassFormSubmission}
    >
      <div className={styles.CreateNewClassFormInnerContainer}>
        <label>Course Name</label>
        <input
          type={"text"}
          maxLength={60}
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
      </div>

      <div className={styles.CreateNewClassFormInnerContainer}>
        <label>Student Grade Year</label>
        <input
          type={"number"}
          min={1}
          max={12}
          value={studentGradeYear}
          onChange={(e) => setStudentGradeYear(e.target.value)}
          style={{ width: "180px" }}
        />
      </div>

      {loading ? (
        <div>Creating class ...</div>
      ) : (
        <button type={"submit"}>Submit</button>
      )}
    </form>
  );
};

export default DisplayCreateNewClassForm;
