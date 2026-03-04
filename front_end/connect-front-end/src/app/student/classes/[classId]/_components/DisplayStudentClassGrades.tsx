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
  const TestResult = (studentGrade: StudentGrade) => {
    console.log(studentGrade);
    if (studentGrade.isGraded) {
      return (
        <Link href={createStudentSubmissionViewUrl(studentGrade.testId)}>
          {studentGrade.testGrade.toFixed(2)}%
        </Link>
      );
    }

    if (studentGrade.isSubmitted) {
      return <div>Grading in-progress</div>;
    }

    return (
      <Link href={createStudentSubmissionUrl(studentGrade.testId)}>
        Submission Required
      </Link>
    );
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
        {studentGrades.map((studentGrade, index) => (
          <tr key={index}>
            <td>{studentGrade.testName}</td>
            <td>{TestResult(studentGrade)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DisplayStudentClassGrades;
