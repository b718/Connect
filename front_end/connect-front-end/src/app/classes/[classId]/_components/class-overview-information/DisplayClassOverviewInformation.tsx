import React, { FC } from "react";
import { CategorizedTests } from "../../_utilities/fetch-student-grades-for-class/categorizeTestsForStudents";
import Link from "next/link";
import styles from "../../page.module.css";

import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { HelpCircle } from "@untitledui/icons";

interface DisplayOverviewInformationProps {
  classId: string;
  studentGrades: CategorizedTests;
}

const DisplayClassOverviewInformation: FC<DisplayOverviewInformationProps> = ({
  classId,
  studentGrades,
}) => {
  const createStudentSubmissionViewUrl = (
    studentId: string,
    testId: string
  ) => {
    return `/classes/${classId}/students/${studentId}/tests/${testId}`;
  };

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
            {student.testGrades.map((testGrade, index) => (
              <td
                key={`${student.studentId}-${studentGrades.tests[index].testId}`}
              >
                <div className={styles.StudentGradeCell}>
                  <Link
                    href={createStudentSubmissionViewUrl(
                      student.studentId,
                      studentGrades.tests[index].testId
                    )}
                    target={"_blank"}
                  >
                    {testGrade.grade.toFixed(2)}%
                  </Link>
                  {testGrade.manualInterventionRequired && (
                    <div className={styles.StudentGradeCellToolTipContainer}>
                      <a
                        data-tooltip-id={"manual-intervention-required"}
                        data-tooltip-content={
                          "This test requires manual intervention."
                        }
                        data-tooltip-place={"top"}
                      >
                        <HelpCircle size={15} />
                      </a>
                      <Tooltip id={"manual-intervention-required"} />
                    </div>
                  )}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DisplayClassOverviewInformation;
