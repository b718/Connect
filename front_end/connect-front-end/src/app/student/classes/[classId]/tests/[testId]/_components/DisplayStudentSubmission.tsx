import React, { FC, useMemo } from "react";

interface DisplayStudentSubmissionProps {
  studentSubmissionUrl: string;
}

const DisplayStudentSubmission: FC<DisplayStudentSubmissionProps> = ({
  studentSubmissionUrl,
}) => {
  const StudentSubmissionDisplay = useMemo(() => {
    return (
      <iframe
        src={studentSubmissionUrl}
        style={{ width: "80%", height: "90vh" }}
      />
    );
  }, [studentSubmissionUrl]);

  if (!studentSubmissionUrl) {
    return <div>{`Error occured while rendering`}</div>;
  }

  return StudentSubmissionDisplay;
};

export default DisplayStudentSubmission;
