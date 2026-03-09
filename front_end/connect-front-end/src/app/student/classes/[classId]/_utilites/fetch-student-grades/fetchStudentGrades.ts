import getServerUrl from "../../../../../../../utilities/fetchApiUrl";
import { GetToken } from "../../../../../../../utilities/getTokenType";

export type StudentGrade = {
  testId: string;
  testName: string;
  testGrade: number;
  isSubmitted: boolean;
  isGraded: boolean;
  testCreationDate: string;
  manualInterventionRequired: boolean;
};

type FetchStudentGradesResponse = {
  statusCode: number;
  message: string;
  data: StudentGrade[];
};

export async function fetchStudentGrades(getToken: GetToken, classId: string) {
  const token = await getToken();
  const serverUrl = getServerUrl();
  const studentGrades = await fetch(
    serverUrl + `/student/classes/${classId}/grades`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  let response: FetchStudentGradesResponse;

  try {
    response = await studentGrades.json();
  } catch (e) {
    throw new Error(
      `Request failed: ${studentGrades.status} ${studentGrades.statusText}. Could not parse response body.`,
    );
  }

  if (!studentGrades.ok) {
    throw new Error(
      `error occured while fetching student class grades: ${response.message}`,
    );
  }

  return response.data;
}
