"use client";

import React, { FormEvent, useContext, useEffect, useState } from "react";
import {
  fetchAllClassOptions,
  Option,
} from "../_utilities/fetch-all-class-options/fetchAllClassOptions";
import Select, { SingleValue } from "react-select";
import styles from "../page.module.css";
import { UserIdContext } from "@/app/_shared/user-id/UserIdContext";
import {
  createStudentRegistrationForClass,
  CreateStudentRegistrationForClassResponse,
} from "../_utilities/create-student-registration-for-class/createStudentRegistrationForClass";

const DisplayAllClassOptions = () => {
  const STUDENT_IN_CLASS_STATUS_CODE = 400;
  const { userId: studentId } = useContext(UserIdContext);
  const [allClassOptions, setAllClassOptions] = useState<Option[]>([]);
  const [selectedClass, setSelectedClass] = useState<Option>();
  const [studentRegistrationResponse, setStudentRegistrationResponse] =
    useState<CreateStudentRegistrationForClassResponse>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [registrationError, setRegistrationError] = useState<Error>();
  const handleJoinClassFormSubmission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClass) return;

    setLoading(true);
    createStudentRegistrationForClass(selectedClass.value, studentId)
      .then((response) => setStudentRegistrationResponse(response))
      .catch((error) => setRegistrationError(error))
      .finally(() => setLoading(false));
  };
  const handleClassSelectionChange = (newValue: SingleValue<Option>) => {
    setStudentRegistrationResponse(undefined);
    setRegistrationError(undefined);

    if (!newValue) {
      setSelectedClass(undefined);
      return;
    }

    setSelectedClass({ ...newValue });
  };

  useEffect(() => {
    fetchAllClassOptions()
      .then((allClassOptions) => setAllClassOptions(allClassOptions))
      .catch((error) => setError(error));
  }, []);

  if (error) {
    return (
      <div className={styles.PageNonContentContainer}>
        {`An error occured while fetching all student class options: ${error.message}`}
      </div>
    );
  }

  if (allClassOptions.length == 0) {
    return (
      <div className={styles.PageNonContentContainer}>
        Loading all classes...
      </div>
    );
  }

  return (
    <div>
      <form
        className={styles.ClassOptionsContainer}
        onSubmit={handleJoinClassFormSubmission}
      >
        <Select
          options={allClassOptions}
          value={selectedClass}
          onChange={handleClassSelectionChange}
          required
          isClearable
          isSearchable
          placeholder={`Class name - Teacher name`}
        />

        <div className={styles.JoinClassButton}>
          {loading ? (
            <p>Registering student ...</p>
          ) : (
            <button>Join class</button>
          )}
        </div>

        <div className={styles.RegistrationResultContainer}>
          {studentRegistrationResponse?.statusCode ===
            STUDENT_IN_CLASS_STATUS_CODE && (
            <p>Student already registered in this class</p>
          )}
          {registrationError && <p>{registrationError.message}</p>}
          {studentRegistrationResponse?.registered && (
            <p>Student successfully registered</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default DisplayAllClassOptions;
