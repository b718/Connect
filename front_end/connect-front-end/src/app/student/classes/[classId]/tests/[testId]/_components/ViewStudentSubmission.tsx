import React, { useContext, useEffect, useState } from "react";

import styles from "../page.module.css";
import { useParams, useRouter } from "next/navigation";
import { UserIdContext } from "@/app/_shared/user-id/UserIdContext";
import { useAuth } from "@clerk/nextjs";
import { fetchStudentSubmissionUrl } from "../_utilities/fetch-student-submission-url/fetchStudentSubmissionUrl";
import DisplayStudentSubmission from "./DisplayStudentSubmission";

const ViewStudentSubmission = () => {
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;
  const testId = params.testId as string;
  const { userId: studentId } = useContext(UserIdContext);
  const { getToken } = useAuth();
  const [studentSubmissionUrl, setStudentSubmissionUrl] = useState<string>("");
  const [error, setError] = useState<Error>();

  useEffect(() => {
    fetchStudentSubmissionUrl(classId, studentId, testId, getToken)
      .then((studentSubmissionUrl) =>
        setStudentSubmissionUrl(studentSubmissionUrl)
      )
      .catch((error) => setError(error));
  });

  if (error) {
    return (
      <div className={styles.PageNonContentContainer}>
        {`An error occured while trying to view your submission: ${error.message}`}
      </div>
    );
  }

  if (studentSubmissionUrl.length == 0) {
    return <div className={styles.PageNonContentContainer}>Loading...</div>;
  }

  return (
    <div className={styles.ViewStudentSubmissionContainer}>
      <button onClick={router.back}>{"Back"}</button>
      <div className={styles.StudentSubmissionContainer}>
        <DisplayStudentSubmission studentSubmissionUrl={studentSubmissionUrl} />
      </div>
    </div>
  );
};

export default ViewStudentSubmission;
