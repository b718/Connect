import { StatusCodes } from "http-status-codes";
import getServerUrl from "../../../../utilities/fetchApiUrl";

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

export async function fetchClasses() {
  const serverUrl = getServerUrl();
  const classes = await fetch(serverUrl + "/classes");
  const response: FetchClassesResponse = await classes.json();

  if (response.statusCode != StatusCodes.OK) {
    throw Error("unable to get classes, please try again");
  }

  return response.data;
}
