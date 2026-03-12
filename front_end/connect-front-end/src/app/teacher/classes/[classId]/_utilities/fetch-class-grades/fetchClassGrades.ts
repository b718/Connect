import getServerUrl from "../../../../../../../utilities/fetchApiUrl";
import { groupGradesByStudent } from "./groupGradesByStudent";

export type ClassGrades = {
  studentId: string;
  firstName: string;
  lastName: string;
  testName: string;
  testId: string;
  testGrade: number;
  viewAnswerKeyUrl: string;
  manualInterventionRequired: boolean;
  isGraded: boolean;
};

type FetchStudentGrades = {
  statusCode: number;
  message: string;
  data: ClassGrades[];
};

export async function fetchClassGrades(classId: string) {
  const serverUrl = getServerUrl();
  const fetchedClassGrades = await fetch(
    serverUrl + `/teacher/classes/${classId}/grades`,
  );

  if (!fetchedClassGrades.ok) {
    throw Error(
      `unable to fetch class, please try again: ${fetchedClassGrades.statusText}`,
    );
  }

  let response: FetchStudentGrades;
  try {
    response = await fetchedClassGrades.json();
  } catch (error) {
    throw Error("unable to fetch class, please try again");
  }

  return groupGradesByStudent(response.data);
}
