import { StatusCodes } from "http-status-codes";
import getServerUrl from "../../../../../../utilities/fetchApiUrl";
import { GetToken } from "../../../../../../utilities/getTokenType";

export type Class = {
  classId: string;
  courseName: string;
  studentGradeYear: number;
  createdAt: string;
};

type FetchClassesResponse = {
  statusCode: number;
  message: string;
  data: Class[];
};

export async function fetchTeacherClasses(getToken: GetToken, userIdLocalStorageKey: string) {
  const token = await getToken();
  const serverUrl = getServerUrl();
  const userId = localStorage.getItem(userIdLocalStorageKey);
  const classes = await fetch(
    serverUrl + `/teacher/classes/teacher/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!classes.ok) {
    throw new Error(
      `error occured while fetching classes: ${classes.statusText}`,
    );
  }

  let response: FetchClassesResponse;
  try {
    response = await classes.json();
  } catch (error) {
    throw Error("unable to get classes, please try again");
  }

  return response.data;
}
