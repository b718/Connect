import getServerUrl from "../../../../../../../utilities/fetchApiUrl";

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
  const fetchedClass = await fetch(serverUrl + `/teacher/classes/${classId}`);

  if (!fetchedClass.ok) {
    throw Error(
      `unable to fetch class, please try again: ${fetchedClass.statusText}`
    );
  }

  let response: FetchClassResponse;
  try {
    response = await fetchedClass.json();
  } catch (error) {
    throw new Error("unable to fetch class, please try again");
  }

  return response.data;
}
