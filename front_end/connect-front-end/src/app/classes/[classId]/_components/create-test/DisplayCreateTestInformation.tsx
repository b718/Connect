import React, { FC, useRef, useState } from "react";
import DisplayUploadedTest from "./DisplayUploadedTest";
import { createTestForClass } from "../../_utilities/create-test/createTestForClass";
import { uploadNewTestFile } from "../../_utilities/create-test/uploadNewTestFile";
import styles from "../../page.module.css";

interface DisplayCreateTestInformationProps {
  classId: string;
}

const DisplayCreateTestInformation: FC<DisplayCreateTestInformationProps> = ({
  classId,
}) => {
  const [testName, setTestName] = useState<string>();
  const [testFile, setTestFile] = useState<File>();
  const [isTestCreated, setIsTestCreated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const testFileInputReference = useRef<HTMLInputElement>(null);

  const handleCreateTestFormSubmission = (e: any) => {
    e.preventDefault();
    if (!testName || !testFile) {
      return;
    }

    setLoading(true);
    setError(null);
    createTestForClass(classId, testName)
      .then((createdTest) =>
        uploadNewTestFile(
          createdTest.presignedUrl,
          testFile,
          createdTest.testId
        )
      )
      .then(() => setIsTestCreated(true))
      .catch((error) => {
        setError(error);
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  const handleFileUploadChange = (e: any) => {
    setTestFile(undefined);
    if (e.target.files && e.target.files.length > 0) {
      setTestFile(e.target.files[0]);
    }
  };

  const handleUploadFile = () => {
    testFileInputReference.current?.click();
  };

  const handleRemoveFile = () => {
    setTestFile(undefined);
    if (testFileInputReference.current) {
      testFileInputReference.current.value = "";
    }
  };

  if (error) {
    return (
      <div className={styles.DisplayCreateTestInformationContainer}>
        {"Something went wrong, please try again"}
      </div>
    );
  }

  if (isTestCreated) {
    return (
      <div className={styles.DisplayCreateTestInformationContainer}>
        {"Test created successfully"}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleCreateTestFormSubmission}
      className={styles.DisplayCreateTestInformationContainer}
    >
      <DisplayUploadedTest testFile={testFile} />
      <div className={styles.DisplayCreateTestFormContainer}>
        <div className={styles.DisplayCreateTestInnerFormContainer}>
          <label>Test Name</label>
          <input
            type="text"
            onChange={(e) => setTestName(e.target.value)}
            required
            value={testName}
          />
        </div>

        <div className={styles.DisplayCreateTestInnerFormContainer}>
          <input
            type="file"
            accept="application/pdf"
            ref={testFileInputReference}
            onChange={handleFileUploadChange}
            className={styles.DisplayCreateTestFileUploadContainer}
            required
          />
          <button type="button" onClick={handleUploadFile}>
            Upload New Test File
          </button>
          <p>{testFile && testFile.name}</p>
          {testFile && (
            <button type="button" onClick={handleRemoveFile}>
              Remove File
            </button>
          )}
        </div>

        {loading ? (
          <div>Creating test...</div>
        ) : (
          <button type="submit">Submit</button>
        )}
      </div>
    </form>
  );
};

export default DisplayCreateTestInformation;
