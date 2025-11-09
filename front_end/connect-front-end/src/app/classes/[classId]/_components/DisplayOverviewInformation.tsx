import React, { FC } from "react";
import { CategorizedTests } from "../_utilities/fetch-student-grades-for-class/categorizeTestsForStudents";
import styles from "../page.module.css";

interface DisplayOverviewInformationProps {
  studentGrades: CategorizedTests;
  classId: string;
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
              {test.viewAnswerKeyUrl ? (
                <a target={"_blank"} href={test.viewAnswerKeyUrl}>
                  {test.testName}
                </a>
              ) : (
                `${test.testName}`
              )}
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
              <td>
                {testGrade.viewStudentSubmissionUrl ? (
                  <a
                    target={"_blank"}
                    href={testGrade.viewStudentSubmissionUrl}
                  >
                    {testGrade.grade.toFixed(2)}%
                  </a>
                ) : (
                  `${testGrade.grade.toFixed(2)}%`
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DisplayOverviewInformation;
