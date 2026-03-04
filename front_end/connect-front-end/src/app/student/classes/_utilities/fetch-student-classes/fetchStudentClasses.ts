import getServerUrl from "../../../../../../utilities/fetchApiUrl";
import { GetToken } from "../../../../../../utilities/getTokenType";

export type Class = {
  classId: string;
  courseName: string;
  studentGradeYear: number;
  createdAt: string;
};

type FetchStudentClassesResponse = {
  statusCode: number;
  message: string;
  data: Class[];
};

export async function fetchStudentClasses(getToken: GetToken) {
  const token = await getToken();
  const serverUrl = getServerUrl();
  const studentClasses = await fetch(serverUrl + `/student/classes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  let response: FetchStudentClassesResponse;

  try {
    response = await studentClasses.json();
  } catch (e) {
    throw new Error(
      `Request failed: ${studentClasses.status} ${studentClasses.statusText}. Could not parse response body.`,
    );
  }

  if (!studentClasses.ok) {
    throw new Error(
      `error occured while fetching classes: ${response.message}`,
    );
  }

  return response.data;
}
