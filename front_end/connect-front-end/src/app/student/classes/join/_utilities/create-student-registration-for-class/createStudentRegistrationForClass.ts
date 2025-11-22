import { StatusCodes } from "http-status-codes";
import getServerUrl from "../../../../../../../utilities/fetchApiUrl";

export type CreateStudentRegistrationForClassResponse = {
  statusCode: number;
  message: string;
  registered: boolean;
};

export async function createStudentRegistrationForClass(
  classId: string,
  studentId: string
) {
  const serverUrl = getServerUrl();
  const createStudentRegistrationForClass = await fetch(
    serverUrl + `/classes/${classId}/students/${studentId}/join/class`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (
    !createStudentRegistrationForClass.ok &&
    createStudentRegistrationForClass.status != StatusCodes.BAD_REQUEST
  ) {
    throw new Error(
      `unable to register student for class: ${createStudentRegistrationForClass.statusText}`
    );
  }

  let response: CreateStudentRegistrationForClassResponse;

  try {
    response = await createStudentRegistrationForClass.json();
  } catch (error) {
    throw new Error(`unable to register student for class`);
  }

  return response;
}
