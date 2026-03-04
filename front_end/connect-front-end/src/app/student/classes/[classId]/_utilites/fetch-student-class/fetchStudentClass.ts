import getServerUrl from "../../../../../../../utilities/fetchApiUrl";
import { GetToken } from "../../../../../../../utilities/getTokenType";

export type Class = {
  classId: string;
  courseName: string;
  studentGradeYear: number;
  createdAt: string;
};

type FetchStudentClassResponse = {
  statusCode: number;
  message: string;
  data: Class;
};

export async function fetchStudentClass(getToken: GetToken, classId: string) {
  const token = await getToken();
  const serverUrl = getServerUrl();
  const studentClass = await fetch(serverUrl + `/student/classes/${classId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  let response: FetchStudentClassResponse;

  try {
    response = await studentClass.json();
  } catch (e) {
    throw new Error(
      `Request failed: ${studentClass.status} ${studentClass.statusText}. Could not parse response body.`,
    );
  }

  if (!studentClass.ok) {
    throw new Error(
      `error occured while fetching student class information: ${response.message}`,
    );
  }

  return response.data;
}
