import React, { FC } from "react";
import { Teacher } from "../_utilities/fetchClass";
import styles from "../page.module.css";

type DisplayTeachersInformationProps = {
  teachers: Teacher[];
};

const DisplayTeachersInformation: FC<DisplayTeachersInformationProps> = ({
  teachers,
}) => {
  return (
    <div className={styles.DisplayTeachersInformationContainer}>
      <p className={styles.DisplayTeachersInformationHeader}>Teachers</p>
      {teachers.map((teacher) => (
        <div
          key={teacher.teacherId}
          className={styles.DisplayTeachersInformationInnerContainer}
        >
          <div>{teacher.firstName}</div>
          <div>{teacher.lastName}</div>
        </div>
      ))}
    </div>
  );
};

export default DisplayTeachersInformation;
