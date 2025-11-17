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

  if (!fetchedStudentGrades.ok) {
    throw Error("unable to fetch class, please try again");
  }

  return categorizeTestsForStudents(response.data);
}
