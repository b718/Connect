import React, { FC } from "react";
import styles from "../page.module.css";
import { CategorizedTests } from "../_utilities/categorizeTestsForStudents";

interface DisplayOverviewInformationProps {
  studentGrades: CategorizedTests;
}

const DisplayOverviewInformation: FC<DisplayOverviewInformationProps> = ({
  studentGrades,
}) => {
  return (
    <table className={styles.DisplayInformationTable}>
      <thead>
        <tr>
          <th>Student Id</th>
          <th>First Name</th>
          <th>Last Name</th>
          {studentGrades.tests.map((test) => (
            <th>
              {test.testName} {test.testId}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {studentGrades.students.map((student) => (
          <tr key={student.studentId}>
            <td>{student.studentId}</td>
            <td>{student.firstName}</td>
            <td>{student.lastName}</td>
            {student.testGrades.map((testGrade) => (
              <td>{testGrade.toFixed(2)}%</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DisplayOverviewInformation;
