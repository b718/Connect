import getServerUrl from "../../../../../../../../../../utilities/fetchApiUrl";

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
  const response: FetchStudentSubmissionUrlResponse =
    await fetchedStudentSubmission.json();

  if (!fetchedStudentSubmission.ok) {
    const response = await fetchedStudentSubmission.json();
    throw new Error(
      `an error occured while fetching student submission: '${response.message}`
    );
  }

  return response.presignedUrl;
}
