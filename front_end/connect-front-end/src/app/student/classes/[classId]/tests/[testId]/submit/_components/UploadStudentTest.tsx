"use client";

import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useRef,
  useState,
} from "react";
import { uploadStudentSubmission } from "../_utilities/upload-student-submission/uploadStudentSubmission";
import { uploadStudentSubmissionEvent } from "../_utilities/upload-student-submission-event/publishStudentSubmissionEvent";
import { UserIdContext } from "@/app/_shared/user-id/UserIdContext";
import { useParams, useRouter } from "next/navigation";
import { fetchStudentSubmissionUrl } from "../_utilities/fetch-student-submission-url/fetchStudentSubmissionUrl";
import styles from "../page.module.css";
import DisplayStudentSubmission from "./DisplayStudentSubmission";

const UploadStudentTest = () => {
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;
  const testId = params.testId as string;
  const { userId: studentId } = useContext(UserIdContext);
  const [studentSubmission, setStudentSubmission] = useState<File>();
  const [uploadStudentSubmissionUrl, setUploadStudentSubmissionUrl] =
    useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const studentSubmissionInputReference = useRef<HTMLInputElement>(null);

  const handleStudentSubmission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!studentSubmission) {
      return;
    }

    setLoading(true);
    fetchStudentSubmissionUrl(classId, studentId, testId)
      .then((uploadStudentSubmissionUrl) => {
        setUploadStudentSubmissionUrl(uploadStudentSubmissionUrl);
        return uploadStudentSubmissionUrl;
      })
      .then((uploadStudentSubmissionUrl) =>
        uploadStudentSubmission(
          uploadStudentSubmissionUrl,
          studentSubmission,
          testId,
        ),
      )
      .then(() => uploadStudentSubmissionEvent(classId, studentId, testId))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  const handleFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStudentSubmission(undefined);
    if (e.target.files && e.target.files.length > 0) {
      setStudentSubmission(e.target.files[0]);
    }
  };

  const uploadFile = () => {
    studentSubmissionInputReference.current?.click();
  };

  const handleRemoveFile = () => {
    setStudentSubmission(undefined);
    if (studentSubmissionInputReference.current) {
      studentSubmissionInputReference.current.value = "";
    }
  };

  if (error) {
    return (
      <div className={styles.PageNonContentContainer}>
        {`Something went wrong, please try again, ${error.message}`}
      </div>
    );
  }

  const StudentSubmissionForm = (
    <div className={styles.StudentSubmissionFormContainer}>
      <div className={styles.UploadStudentTestFileSubmissionContainer}>
        <input
          type={"file"}
          accept={"application/pdf"}
          ref={studentSubmissionInputReference}
          onChange={handleFileUploadChange}
          className={styles.UploadStudentTestFileSubmissionInput}
          required
        />
        <button type={"button"} onClick={uploadFile}>
          Upload New Submission
        </button>

        {studentSubmission && <p>{studentSubmission.name}</p>}
        {studentSubmission && (
          <button onClick={handleRemoveFile}>Remove Submission</button>
        )}
      </div>

      {loading ? (
        <div>Submitting...</div>
      ) : (
        <button type={"submit"}>Submit</button>
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleStudentSubmission}
      className={styles.UploadStudentTestContainer}
    >
      {uploadStudentSubmissionUrl?.length > 0 ? (
        <div>Submission submitted succesfully</div>
      ) : (
        <div className={styles.StudentSubmissionContainer}>
          <button onClick={router.back} type={"button"}>
            {"Back"}
          </button>
          <div className={styles.DisplayStudentSubmissionContainer}>
            <DisplayStudentSubmission
              studentSubmissionFile={studentSubmission}
            />
            {StudentSubmissionForm}
          </div>
        </div>
      )}
    </form>
  );
};

export default UploadStudentTest;
