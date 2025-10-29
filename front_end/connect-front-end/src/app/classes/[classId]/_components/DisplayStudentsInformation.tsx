import React, { FC } from "react";
import { Student } from "../_utilities/fetchClass";
import styles from "../page.module.css";

type DisplayStudentsInformationProps = {
  students: Student[];
};

const DisplayStudentsInformation: FC<DisplayStudentsInformationProps> = ({
  students,
}) => {
  return (
    <table className={styles.DisplayInformationTable}>
      <tr>
        <th>Student Id</th>
        <th>First Name</th>
        <th>Last Name</th>
      </tr>

      {students.map((student) => (
        <tr key={student.studentId}>
          <td>{student.studentId}</td>
          <td>{student.firstName}</td>
          <td>{student.lastName}</td>
        </tr>
      ))}
    </table>
  );
};

export default DisplayStudentsInformation;
