import React, { FC } from "react";
import Link from "next/link";
import styles from "../../page.module.css";
import { CategorizedClassGrades } from "../../_utilities/fetch-class-grades/groupGradesByStudent";

import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { HelpCircle } from "@untitledui/icons";

interface DisplayOverviewInformationProps {
  classId: string;
  classGrades: CategorizedClassGrades;
}

const DisplayClassOverviewInformation: FC<DisplayOverviewInformationProps> = ({
  classId,
  classGrades,
}) => {
  const createStudentSubmissionViewUrl = (
    studentId: string,
    testId: string,
  ) => {
    return `/teacher/classes/${classId}/students/${studentId}/tests/${testId}`;
  };

  return (
    <table className={styles.DisplayInformationTable}>
      <thead>
        <tr>
          <th>Student Id</th>
          <th>First Name</th>
          <th>Last Name</th>
          {classGrades.tests.map((test, index) => (
            <th key={index}>
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
        {classGrades.students.map((student) => (
          <tr key={student.studentId}>
            <td>{student.studentId}</td>
            <td>{student.firstName}</td>
            <td>{student.lastName}</td>
            {student.testGrades.map((testGrade, index) => (
              <td
                key={`${student.studentId}-${classGrades.tests[index].testId}`}
              >
                <div className={styles.StudentGradeCell}>
                  <Link
                    href={createStudentSubmissionViewUrl(
                      student.studentId,
                      classGrades.tests[index].testId,
                    )}
                  >
                    {testGrade.isGraded ? `${testGrade.grade.toFixed(2)}%` : "Grading in-progress"}
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
