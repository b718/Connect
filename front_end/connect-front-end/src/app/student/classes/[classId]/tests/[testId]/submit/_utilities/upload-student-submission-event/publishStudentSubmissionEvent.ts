import getServerUrl from "../../../../../../../../../../utilities/fetchApiUrl";

export async function uploadStudentSubmissionEvent(
  classId: string,
  studentId: string,
  testId: string
) {
  const serverUrl = getServerUrl();
  const studentSubmissionEvent = await fetch(
    serverUrl +
      `/classes/${classId}/students/${studentId}/tests/${testId}/grade`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!studentSubmissionEvent.ok) {
    throw new Error(
      "an error occured during the student submission, please try again"
    );
  }
}
