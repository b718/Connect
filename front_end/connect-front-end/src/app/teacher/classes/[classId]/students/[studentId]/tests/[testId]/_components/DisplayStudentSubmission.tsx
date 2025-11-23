import React, { FC, useMemo } from "react";

interface DisplayStudentSubmissionProps {
  studentSubmissionUrl: string;
}

const DisplayStudentSubmission: FC<DisplayStudentSubmissionProps> = ({
  studentSubmissionUrl,
}) => {
  const StudentSubmission = useMemo(() => {
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

  return StudentSubmission;
};

export default DisplayStudentSubmission;
