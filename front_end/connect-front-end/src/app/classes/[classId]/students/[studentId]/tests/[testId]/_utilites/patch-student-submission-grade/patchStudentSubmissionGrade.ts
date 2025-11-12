import getServerUrl from "../../../../../../../../../../utilities/fetchApiUrl";

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
    serverUrl + `/students/${studentId}/tests/${testId}/submissions`,
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
  const response: PatchStudentSubmissionGradeResponse =
    await studentSubmissionGradeUpdate.json();

  if (!studentSubmissionGradeUpdate.ok) {
    const response: PatchStudentSubmissionGradeResponse =
      await studentSubmissionGradeUpdate.json();
    throw new Error(
      `an error occured while updating the student grade, '${response.message}'`
    );
  }

  return response.newGrade;
}
