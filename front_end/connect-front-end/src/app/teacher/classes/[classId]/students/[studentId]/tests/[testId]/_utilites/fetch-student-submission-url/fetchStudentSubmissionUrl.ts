import getServerUrl from "../../../../../../../../../../../utilities/fetchApiUrl";

type FetchStudentSubmissionUrlResponse = {
  presignedUrl: string;
};

export async function fetchStudentSubmissionUrl(
  classId: string,
  studentId: string,
  testId: string
) {
  const serverUrl = getServerUrl();
  const fetchedStudentSubmission = await fetch(
    serverUrl +
      `/classes/${classId}/students/${studentId}/tests/${testId}/submissions`
  );

  if (!fetchedStudentSubmission.ok) {
    throw new Error(
      `an error occured while fetching student submission: '${fetchedStudentSubmission.statusText}`
    );
  }

  let response: FetchStudentSubmissionUrlResponse;
  try {
    response = await fetchedStudentSubmission.json();
  } catch (error) {
    throw new Error("an error occured while fetching student submissiom");
  }

  return response.presignedUrl;
}
