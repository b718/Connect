import React, { FC, useEffect, useState } from "react";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import styles from "../page.module.css";

interface DisplayStudentSubmissionProps {
  studentSubmissionFile: File | undefined;
}

const DisplayStudentSubmission: FC<DisplayStudentSubmissionProps> = ({
  studentSubmissionFile,
}) => {
  const [studentSubmissionFileBytes, setStudentSubmissionFileBytes] =
    useState<Uint8Array>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (!studentSubmissionFile) {
      setStudentSubmissionFileBytes(undefined);
      return;
    }

    studentSubmissionFile
      .arrayBuffer()
      .then((bytes) => setStudentSubmissionFileBytes(new Uint8Array(bytes)))
      .catch((error) => setError(error));
  }, [studentSubmissionFile]);

  if (!studentSubmissionFile) {
    return null;
  }

  if (error || !studentSubmissionFileBytes) {
    return (
      <div>
        {`Error occured while rendering ${studentSubmissionFile.name}`}
        {error && error.message}
      </div>
    );
  }

  return (
    <div className={styles.StudentSubmissionContainer}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer fileUrl={studentSubmissionFileBytes} />
      </Worker>
    </div>
  );
};

export default DisplayStudentSubmission;
