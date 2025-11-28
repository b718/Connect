import React, { FC } from "react";
import { Student } from "../../_utilities/fetch-class/fetchClass";
import styles from "../../page.module.css";

type DisplayStudentsInformationProps = {
  students: Student[];
};

const DisplayStudentsInformation: FC<DisplayStudentsInformationProps> = ({
  students,
}) => {
  return (
    <table className={styles.DisplayInformationTable}>
      <thead>
        <tr>
          <th>Student Id</th>
          <th>First Name</th>
          <th>Last Name</th>
        </tr>
      </thead>

      <tbody>
        {students?.map((student) => (
          <tr key={student.studentId}>
            <td>{student.studentId}</td>
            <td>{student.firstName}</td>
            <td>{student.lastName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DisplayStudentsInformation;
