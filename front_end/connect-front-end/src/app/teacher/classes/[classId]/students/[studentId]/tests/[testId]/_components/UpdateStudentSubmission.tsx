"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchStudentSubmissionUrl } from "../_utilites/fetch-student-submission-url/fetchStudentSubmissionUrl";
import styles from "../page.module.css";
import DisplayStudentSubmission from "./DisplayStudentSubmission";
import DisplayUpdateGradeForm from "./DisplayUpdateGradeForm";

const UpdateStudentSubmission = () => {
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;
  const studentId = params.studentId as string;
  const testId = params.testId as string;

  const [studentSubmissionUrl, setStudentSubmissionUrl] = useState<string>("");
  const [error, setError] = useState<Error>();

  useEffect(() => {
    fetchStudentSubmissionUrl(classId, studentId, testId)
      .then((studentSubmissionUrl) =>
        setStudentSubmissionUrl(studentSubmissionUrl),
      )
      .catch((error) => setError(error));
  }, []);

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
        <DisplayUpdateGradeForm studentId={studentId} testId={testId} />
      </div>
    </div>
  );
};

export default UpdateStudentSubmission;
