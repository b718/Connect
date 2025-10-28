import { StatusCodes } from "http-status-codes";
import getServerUrl from "../../../../../utilities/fetchApiUrl";

export type Teacher = {
  teacherId: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
};

export type Student = {
  studentId: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
};

export type ClassInformation = {
  courseName: string;
  studentGradeYear: number;
  teachers: Teacher[];
  students: Student[];
};

type FetchClassResponse = {
  statusCode: number;
  message: string;
  data: ClassInformation;
};

export const defaultClassInformation: ClassInformation = {
  courseName: "",
  studentGradeYear: 0,
  teachers: [],
  students: [],
};

export async function fetchClass(classId: string) {
  const serverUrl = getServerUrl();
  const fetchedClass = await fetch(serverUrl + "/classes/" + classId);
  const response: FetchClassResponse = await fetchedClass.json();

  if (response.statusCode != StatusCodes.OK) {
    throw Error("unable to fetch class, please try again");
  }

  const moreStudents = [];

  for (let i = 0; i < 10; i++) {
    moreStudents.push(...response.data.students);
  }

  const newData = {
    courseName: response.data.courseName,
    studentGradeYear: response.data.studentGradeYear,
    students: moreStudents,
    teachers: response.data.teachers,
  };

  return newData;
}
