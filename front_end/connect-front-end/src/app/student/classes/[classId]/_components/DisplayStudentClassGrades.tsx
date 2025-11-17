import React, { FC } from "react";
import { StudentGrade } from "../_utilites/fetch-student-grades/fetchStudentGrades";
import styles from "../page.module.css";
import Link from "next/link";

interface DisplayStudentClassGradesProps {
  studentGrades: StudentGrade[];
  classId: string;
}

const DisplayStudentClassGrades: FC<DisplayStudentClassGradesProps> = ({
  studentGrades,
  classId,
}) => {
  const createStudentSubmissionViewUrl = (testId: string) => {
    return `/student/classes/${classId}/tests/${testId}`;
  };
  const createStudentSubmissionUrl = (testId: string) => {
    return `/student/classes/${classId}/tests/${testId}/submit`;
  };

  return (
    <table className={styles.StudentClassGradesTable}>
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Test Grade</th>
        </tr>
      </thead>

      <tbody>
        {studentGrades.map((studentGrade) => (
          <tr>
            <td>{studentGrade.testName}</td>
            <td>
              {studentGrade.isSubmitted ? (
                <Link
                  href={createStudentSubmissionViewUrl(studentGrade.testId)}
                >
                  {studentGrade.testGrade.toFixed(2)}%
                </Link>
              ) : (
                <Link href={createStudentSubmissionUrl(studentGrade.testId)}>
                  Submission Required
                </Link>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DisplayStudentClassGrades;
