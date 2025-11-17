import getServerUrl from "../../../../../../utilities/fetchApiUrl";

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

export async function fetchClass(classId: string) {
  const serverUrl = getServerUrl();
  const fetchedClass = await fetch(serverUrl + "/classes/" + classId);
  const response: FetchClassResponse = await fetchedClass.json();

  if (!fetchedClass.ok) {
    throw Error("unable to fetch class, please try again");
  }

  return response.data;
}
