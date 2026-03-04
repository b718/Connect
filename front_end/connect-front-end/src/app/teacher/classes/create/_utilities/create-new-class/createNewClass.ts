import getServerUrl from "../../../../../../../utilities/fetchApiUrl";
import { GetToken } from "../../../../../../../utilities/getTokenType";

type CreateNewClassRequest = {
  courseName: string;
  studentGradeYear: number;
};

type CreateNewClassResponse = {
  statusCode: number;
  message: string;
  classCreated: boolean;
};

export async function createNewClass(
  getToken: GetToken,
  courseName: string,
  studentGradeYear: string,
) {
  const token = await getToken();
  const serverUrl = getServerUrl();
  const request: CreateNewClassRequest = {
    courseName: courseName,
    studentGradeYear: Number.parseInt(studentGradeYear),
  };
  const newClass = await fetch(serverUrl + "/teacher/classes/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!newClass.ok) {
    throw new Error(`failed to create new class: ${newClass.statusText}`);
  }

  let response: CreateNewClassResponse;
  try {
    response = await newClass.json();
  } catch (error) {
    throw new Error("failed to create new classs");
  }

  return response.classCreated;
}
