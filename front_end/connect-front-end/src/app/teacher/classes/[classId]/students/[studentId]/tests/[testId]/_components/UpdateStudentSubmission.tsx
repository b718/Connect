"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchStudentSubmissionUrl } from "../_utilites/fetch-student-submission-url/fetchStudentSubmissionUrl";
import styles from "../page.module.css";
import DisplayStudentSubmission from "./DisplayStudentSubmission";
import DisplayUpdateGradeForm from "./DisplayUpdateGradeForm";
import {
  fetchStudentSubmissionGradeInformation,
  StudentSubmissionGradeInformation,
} from "../_utilites/fetch-student-submission-grade-information/fetchStudentSubmissionGradeInformation";

const UpdateStudentSubmission = () => {
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;
  const studentId = params.studentId as string;
  const testId = params.testId as string;

  const [studentSubmissionUrl, setStudentSubmissionUrl] = useState<string>("");
  const [
    studentSubmissionGradeInformation,
    setStudentSubmissionGradeInformation,
  ] = useState<StudentSubmissionGradeInformation | null>(null);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    Promise.all([
      fetchStudentSubmissionUrl(classId, studentId, testId),
      fetchStudentSubmissionGradeInformation(studentId, testId),
    ])
      .then(([studentSubmissionUrl, studentSubmissionGradeInformation]) => {
        setStudentSubmissionUrl(studentSubmissionUrl);
        setStudentSubmissionGradeInformation(studentSubmissionGradeInformation);
      })
      .catch((error) => setError(error));
  }, [classId, studentId, testId]);

  if (error) {
    return (
      <div className={styles.PageNonContentContainer}>
        {
          "An error occured while loading the update student submission component,please try again"
        }
      </div>
    );
  }

  if (studentSubmissionUrl.length === 0) {
    <div className={styles.PageNonContentContainer}>
      {
        "An error occured while loading the student submission, please try again"
      }
    </div>;
  }

  return (
    <div className={styles.UpdateStudentSubmissionContainer}>
      <button onClick={router.back}>{"Back"}</button>
      <div className={styles.UpdateStudentSubmissionFormContainer}>
        <DisplayStudentSubmission studentSubmissionUrl={studentSubmissionUrl} />
        <DisplayUpdateGradeForm
          studentId={studentId}
          testId={testId}
          studentSubmissionGradeInformation={studentSubmissionGradeInformation}
        />
      </div>
    </div>
  );
};

export default UpdateStudentSubmission;
