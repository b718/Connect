import getServerUrl from "../../../../../../../../../../utilities/fetchApiUrl";

export async function uploadStudentSubmissionEvent(
  classId: string,
  studentId: string,
  testId: string
) {
  const serverUrl = getServerUrl();
  const studentSubmissionEvent = await fetch(
    serverUrl +
      `/student/classes/${classId}/students/${studentId}/tests/${testId}/grade`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!studentSubmissionEvent.ok) {
    throw new Error(
      `Request failed: ${studentSubmissionEvent.status} ${studentSubmissionEvent.statusText}. Could not parse response body.`
    );
  }
}
