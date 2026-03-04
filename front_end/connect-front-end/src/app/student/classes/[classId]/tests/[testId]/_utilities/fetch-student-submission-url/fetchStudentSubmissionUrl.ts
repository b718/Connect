import getServerUrl from "../../../../../../../../../utilities/fetchApiUrl";

type FetchStudentSubmissionUrlResponse = {
  presignedUrl: string;
};

export async function fetchStudentSubmissionUrl(
  classId: string,
  studentId: string,
  testId: string,
  getToken: Function,
) {
  const token = await getToken();
  const serverUrl = getServerUrl();
  const fetchedStudentSubmission = await fetch(
    serverUrl +
      `/classes/${classId}/students/${studentId}/tests/${testId}/submissions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  let response: FetchStudentSubmissionUrlResponse;

  try {
    response = await fetchedStudentSubmission.json();
  } catch (e) {
    throw new Error(
      `Request failed: ${fetchedStudentSubmission.status} ${fetchedStudentSubmission.statusText}. Could not parse response body.`,
    );
  }

  if (!fetchedStudentSubmission.ok) {
    throw new Error("error occured while fetching student submission");
  }

  return response.presignedUrl;
}
