import getServerUrl from "../../../../../../../utilities/fetchApiUrl";

export type Class = {
  classId: string;
  courseName: string;
  studentGradeYear: number;
  createdAt: string;
};

type FetchAllClassesResponse = {
  statusCode: number;
  message: string;
  data: Class[];
};

export async function fetchAllClasses() {
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

  return response.data;
}
