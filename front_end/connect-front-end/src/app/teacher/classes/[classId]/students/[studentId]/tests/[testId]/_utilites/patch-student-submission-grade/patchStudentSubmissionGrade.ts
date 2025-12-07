import getServerUrl from "../../../../../../../../../../../utilities/fetchApiUrl";

type PatchStudentSubmissionGradeResponse = {
  statusCode: number;
  message: string;
  newGrade: number;
};

export async function patchStudentSubmissionGrade(
  studentId: string,
  testId: string,
  newGrade: number
) {
  const serverUrl = getServerUrl();
  const studentSubmissionGradeUpdate = await fetch(
    serverUrl + `/teacher/students/${studentId}/tests/${testId}/submissions`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newGrade: newGrade,
      }),
    }
  );

  if (!studentSubmissionGradeUpdate.ok) {
    throw new Error(
      `an error occured while updating the student grade, '${studentSubmissionGradeUpdate.statusText}'`
    );
  }

  let response: PatchStudentSubmissionGradeResponse;
  try {
    response = await studentSubmissionGradeUpdate.json();
  } catch (error) {
    throw new Error(
      "an error occured while updating the student grade. please try again"
    );
  }

  return response.newGrade;
}
