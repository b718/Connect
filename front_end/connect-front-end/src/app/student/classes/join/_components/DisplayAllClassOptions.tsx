"use client";

import React, { FormEvent, useEffect, useState } from "react";
import {
  fetchAllClassOptions,
  Option,
} from "../_utilities/fetch-all-class-options/fetchAllClassOptions";
import Select, { SingleValue } from "react-select";
import styles from "../page.module.css";

const DisplayAllClassOptions = () => {
  const [allClassOptions, setAllClassOptions] = useState<Option[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<Option>();
  const [error, setError] = useState<Error>();
  const handleJoinClassFormSubmission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(selectedClassId);
  };
  const handleClassSelectionChange = (newValue: SingleValue<Option>) => {
    if (!newValue) return setSelectedClassId(undefined);
    setSelectedClassId({ ...newValue });
  };

  useEffect(() => {
    fetchAllClassOptions()
      .then((allClassOptions) => setAllClassOptions(allClassOptions))
      .catch((error) => setError(error));
  }, []);

  if (error) {
    <div
      className={styles.PageNonContentContainer}
    >{`Error encountered while fetching all classes: ${error.message}`}</div>;
  }

  if (allClassOptions.length == 0) {
    <div className={styles.PageNonContentContainer}>
      Loading all classes...
    </div>;
  }

  return (
    <div>
      <form
        className={styles.ClassOptionsContainer}
        onSubmit={handleJoinClassFormSubmission}
      >
        <Select
          options={allClassOptions}
          value={selectedClassId}
          onChange={handleClassSelectionChange}
          required
          isClearable
          isSearchable
          placeholder={`Class name - Teacher name`}
        />

        <div className={styles.JoinClassButton}>
          <button>Join class</button>
        </div>
      </form>
    </div>
  );
};

export default DisplayAllClassOptions;
