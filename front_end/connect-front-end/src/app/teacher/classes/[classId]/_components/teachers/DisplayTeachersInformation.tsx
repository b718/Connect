import React, { FC } from "react";
import { Teacher } from "../../_utilities/fetch-class/fetchClass";
import styles from "../../page.module.css";

type DisplayTeachersInformationProps = {
  teachers: Teacher[];
};

const DisplayTeachersInformation: FC<DisplayTeachersInformationProps> = ({
  teachers,
}) => {
  return (
    <table className={styles.DisplayInformationTable}>
      <thead>
        <tr>
          <th>Teacher Id</th>
          <th>First Name</th>
          <th>Last Name</th>
        </tr>
      </thead>

      <tbody>
        {teachers?.map((teacher) => (
          <tr key={teacher.teacherId}>
            <td>{teacher.teacherId}</td>
            <td>{teacher.firstName}</td>
            <td>{teacher.lastName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DisplayTeachersInformation;
