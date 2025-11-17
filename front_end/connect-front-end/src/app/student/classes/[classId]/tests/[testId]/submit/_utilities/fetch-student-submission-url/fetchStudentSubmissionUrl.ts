import getServerUrl from "../../../../../../../../../../utilities/fetchApiUrl";

type FetchStudentSubmissionUrlResponse = {
  statusCode: number;
  presignedUrl: string;
  message: string;
};

export async function fetchStudentSubmissionUrl(
  classId: string,
  studentId: string,
  testId: string
) {
  const serverUrl = getServerUrl();
  const studentSubmissionUrl = await fetch(
    serverUrl +
      `/classes/${classId}/students/${studentId}/tests/${testId}/grade`
  );
  let response: FetchStudentSubmissionUrlResponse;

  try {
    response = await studentSubmissionUrl.json();
  } catch (error) {
    throw new Error(
      `Request failed: ${studentSubmissionUrl.status} ${studentSubmissionUrl.statusText}. Could not parse response body.`
    );
  }

  if (!studentSubmissionUrl.ok) {
    throw new Error(
      "error occured while uploading submission, please try again"
    );
  }

  return response.presignedUrl;
}
