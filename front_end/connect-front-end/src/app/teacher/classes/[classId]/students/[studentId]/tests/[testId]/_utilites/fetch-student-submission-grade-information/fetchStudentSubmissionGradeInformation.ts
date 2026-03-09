import getServerUrl from "../../../../../../../../../../../utilities/fetchApiUrl";

export type StudentSubmissionGradeInformation = {
  testGrade: number;
  gradeResultReasoning: string;
};

type FetchStudentSubmissionGradeInformationResponse = {
  data: StudentSubmissionGradeInformation | null;
};

export async function fetchStudentSubmissionGradeInformation(
  studentId: string,
  testId: string,
) {
  const serverUrl = getServerUrl();
  const fetchedStudentSubmissionGradeInformation = await fetch(
    serverUrl + `/teacher/students/${studentId}/tests/${testId}/submissions`,
  );

  if (!fetchedStudentSubmissionGradeInformation.ok) {
    throw new Error(
      `an error occured while fetching student submission grade information: '${fetchedStudentSubmissionGradeInformation.statusText}`,
    );
  }

  let response: FetchStudentSubmissionGradeInformationResponse;
  try {
    response = await fetchedStudentSubmissionGradeInformation.json();
  } catch (error) {
    throw new Error(
      "an error occured while fetching student submission grade information:",
    );
  }

  return response.data;
}
