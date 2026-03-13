import React, { FC } from "react";
import { Tests } from "../../_utilities/fetch-tests/fetchTests";
import styles from "../../page.module.css";
import Link from "next/link";

interface DisplayTestsInformationProps {
  tests: Tests[];
}

const DisplayTestsInformation: FC<DisplayTestsInformationProps> = ({
  tests,
}) => {
  return (
    <table className={styles.DisplayInformationTable}>
      <thead>
        <tr>
          <th>Test Name</th>
          <th> </th>
        </tr>
      </thead>

      <tbody>
        {tests.map((test) => (
          <tr key={test.testId}>
            <td>{test.testName}</td>
            <td>
              <Link href={test.answerKeyUrl} target={"_blank"}>
                View Test
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DisplayTestsInformation;
