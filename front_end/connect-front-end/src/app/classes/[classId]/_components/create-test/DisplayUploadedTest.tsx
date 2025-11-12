"use client";

import React, { FC, useEffect, useState } from "react";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import styles from "../../page.module.css";

type DisplayUploadedTestProps = {
  testFile: File | undefined;
};

const DisplayUploadedTest: FC<DisplayUploadedTestProps> = ({ testFile }) => {
  const [testFileBytes, setTestFileBytes] = useState<Uint8Array>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (!testFile) {
      setTestFileBytes(undefined);
      return;
    }

    testFile
      .arrayBuffer()
      .then((bytes) => setTestFileBytes(new Uint8Array(bytes)))
      .catch((error) => setError(error));
  }, [testFile]);

  if (!testFile) {
    return null;
  }

  if (error || !testFileBytes) {
    return <div>{`Error occured while rendering ${testFile.name}`}</div>;
  }

  return (
    <div className={styles.DisplayUploadedTestContainer}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer fileUrl={testFileBytes} />
      </Worker>
    </div>
  );
};

export default DisplayUploadedTest;
