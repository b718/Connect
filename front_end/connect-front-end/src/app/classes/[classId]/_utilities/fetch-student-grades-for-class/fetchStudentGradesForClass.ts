import { StatusCodes } from "http-status-codes";
import getServerUrl from "../../../../../../utilities/fetchApiUrl";
import { categorizeTestsForStudents } from "./categorizeTestsForStudents";

export type StudentGrades = {
  studentId: string;
  firstName: string;
  lastName: string;
  testName: string;
  testId: string;
  testGrade: number;
  viewAnswerKeyUrl: string;
  viewStudentSubmissionUrl: string;
  manualInterventionRequired: boolean;
};

type FetchStudentGrades = {
  statusCode: number;
  message: string;
  data: StudentGrades[];
};

export async function fetchStudentGrades(classId: string) {
  const serverUrl = getServerUrl();
  const fetchedStudentGrades = await fetch(
    serverUrl + "/classes/" + classId + "/grades"
  );
  const response: FetchStudentGrades = await fetchedStudentGrades.json();

  if (response.statusCode != StatusCodes.OK) {
    throw Error("unable to fetch class, please try again");
  }

  return categorizeTestsForStudents(response.data);
}
