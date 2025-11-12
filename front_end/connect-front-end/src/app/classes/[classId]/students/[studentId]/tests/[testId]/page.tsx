"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchStudentSubmissionUrl } from "./_utilites/fetch-student-submission-url/fetchStudentSubmissionUrl";
import DisplayStudentSubmission from "./_components/DisplayStudentSubmission";
import styles from "./page.module.css";
import Sidebar from "@/app/_shared/Sidebar";
import MainScreen from "@/app/_shared/MainScreen";
import DisplayUpdateGradeForm from "./_components/DisplayUpdateGradeForm";

const page = () => {
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
        setStudentSubmissionUrl(studentSubmissionUrl)
      )
      .catch((error) => setError(error));
  }, []);

  if (error || studentSubmissionUrl?.length == 0) {
    <div></div>;
  }

  const StudentSubmissionViewingComponent = (
    <div className={styles.DisplayStudentSubmissionContainer}>
      <button onClick={router.back}>{"Back"}</button>
      <div className={styles.DisplayStudentSubmissionFormContainers}>
        <DisplayStudentSubmission studentSubmissionUrl={studentSubmissionUrl} />
        <DisplayUpdateGradeForm studentId={studentId} testId={testId} />
      </div>
    </div>
  );

  return (
    <div className={styles.PageContainer}>
      <Sidebar />
      <MainScreen component={StudentSubmissionViewingComponent} />
    </div>
  );
};

export default page;
