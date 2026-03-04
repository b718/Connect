import React, { FC, FormEvent, useRef, useState } from "react";
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

  const handleCreateTestFormSubmission = (e: FormEvent<HTMLFormElement>) => {
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
          createdTest.testId,
        ),
      )
      .then(() => setIsTestCreated(true))
      .catch((error) => {
        setError(error);
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
      <div className={styles.PageNonContentContainer}>
        {"Something went wrong, please try again"}
      </div>
    );
  }

  if (isTestCreated) {
    return (
      <div className={styles.PageNonContentContainer}>
        {"Test created successfully"}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleCreateTestFormSubmission}
      className={styles.CreateTestInformationContainer}
    >
      <DisplayUploadedTest testFile={testFile} />
      <div className={styles.CreateTestFormContainer}>
        <div className={styles.CreateTestInnerFormContainer}>
          <label>Test Name</label>
          <input
            type="text"
            onChange={(e) => setTestName(e.target.value)}
            required
            value={testName}
          />
        </div>

        <div className={styles.CreateTestInnerFormContainer}>
          <input
            type="file"
            accept="application/pdf"
            ref={testFileInputReference}
            onChange={handleFileUploadChange}
            className={styles.CreateTestFileInput}
            required
          />
          <button type="button" onClick={handleUploadFile}>
            Upload New Test File
          </button>
          {testFile && <p>{testFile.name}</p>}
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
