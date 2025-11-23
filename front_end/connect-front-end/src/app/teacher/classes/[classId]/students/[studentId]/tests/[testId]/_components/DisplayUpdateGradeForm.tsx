import React, { FC, FormEvent, useState } from "react";
import { patchStudentSubmissionGrade } from "../_utilites/patch-student-submission-grade/patchStudentSubmissionGrade";
import styles from "../page.module.css";

interface DisplayUpdateGradeFormProps {
  studentId: string;
  testId: string;
}

const DisplayUpdateGradeForm: FC<DisplayUpdateGradeFormProps> = ({
  studentId,
  testId,
}) => {
  const DEFAULT_GRADE = -1;
  const [grade, setGrade] = useState<number>(DEFAULT_GRADE);
  const [newGrade, setNewGrade] = useState<number>(DEFAULT_GRADE);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  const handleGradeChange = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (grade === DEFAULT_GRADE) {
      return;
    }

    setLoading(true);
    patchStudentSubmissionGrade(studentId, testId, grade)
      .then((newGrade) => setNewGrade(newGrade))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  if (error) {
    return (
      <div className={styles.UpdateGradeFormContainer}>
        {"Grade update failed, please try again"}
      </div>
    );
  }

  const UpdateGradeForm = (
    <>
      <label htmlFor="gradeInput">Update Grade (%)</label>
      <input
        id="gradeInput"
        type={"number"}
        step={"any"}
        onChange={(e) => setGrade(Number.parseFloat(e.target.value))}
        required
        min={0}
        max={100}
      />

      {loading ? (
        <div>Updating grade...</div>
      ) : (
        <button type={"submit"} disabled={grade <= DEFAULT_GRADE}>
          Submit
        </button>
      )}
    </>
  );

  return (
    <form
      className={styles.UpdateGradeFormContainer}
      onSubmit={handleGradeChange}
    >
      {newGrade === DEFAULT_GRADE ? (
        <div className={styles.UpdatedGradeContainer}>{UpdateGradeForm}</div>
      ) : (
        <div className={styles.UpdatedGradeContainer}>
          <span>Grade successfully updated to {newGrade.toFixed(2)}%</span>
        </div>
      )}
    </form>
  );
};

export default DisplayUpdateGradeForm;
