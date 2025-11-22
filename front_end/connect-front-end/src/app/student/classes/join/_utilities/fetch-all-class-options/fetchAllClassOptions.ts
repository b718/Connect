import getServerUrl from "../../../../../../../utilities/fetchApiUrl";

type Teacher = {
  teacherId: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
};

export type Class = {
  classId: string;
  courseName: string;
  studentGradeYear: number;
  createdAt: string;
  teachers: Teacher[];
};

export type Option = {
  value: string;
  label: string;
};

type FetchAllClassesResponse = {
  statusCode: number;
  message: string;
  data: Class[];
};

export async function fetchAllClassOptions() {
  const serverUrl = getServerUrl();
  const allClasses = await fetch(serverUrl + "/classes");

  if (!allClasses.ok) {
    throw new Error(`Failed to fetch all classes: ${allClasses.statusText}`);
  }

  let response: FetchAllClassesResponse;

  try {
    response = await allClasses.json();
  } catch (error) {
    throw new Error(`Failed to fetch all classes`);
  }

  return response.data.map((avaliableClass) => {
    let label = `${avaliableClass.courseName} - `;
    if (avaliableClass.teachers.length > 0) {
      const teacher = avaliableClass.teachers[0];
      label += teacher.firstName + " " + teacher.lastName;
    }

    const option: Option = {
      value: avaliableClass.classId,
      label: label,
    };

    return option;
  });
}
