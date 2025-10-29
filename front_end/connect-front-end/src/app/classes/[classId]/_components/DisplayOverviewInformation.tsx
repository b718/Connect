import React, { FC } from "react";
import styles from "../page.module.css";
import { StudentGrades } from "../_utilities/fetchStudentGradesForClass";

interface DisplayOverviewInformationProps {
  studentGrades: StudentGrades[];
}

const DisplayOverviewInformation: FC<DisplayOverviewInformationProps> = ({
  studentGrades,
}) => {
  return (
    <table className={styles.DisplayInformationTable}>
      <tr>
        <th>Student Id</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Test Name</th>
        <th>Test Grade</th>
      </tr>

      {studentGrades.map((student) => (
        <tr key={student.studentId}>
          <td>{student.studentId}</td>
          <td>{student.firstName}</td>
          <td>{student.lastName}</td>
          <td>{student.testName}</td>
          <td>{student.testGrade.toFixed(2)}%</td>
        </tr>
      ))}
    </table>
  );
};

export default DisplayOverviewInformation;
