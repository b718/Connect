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
    <div className={styles.DisplayStudentsInformationContainer}>
      <p className={styles.DisplayStudentsInformationHeader}>Students</p>
      {students.map((student) => (
        <div
          key={student.studentId}
          className={styles.DisplayStudentsInformationInnerContainer}
        >
          <div>{student.firstName}</div>
          <div>{student.lastName}</div>
        </div>
      ))}
    </div>
  );
};

export default DisplayStudentsInformation;
