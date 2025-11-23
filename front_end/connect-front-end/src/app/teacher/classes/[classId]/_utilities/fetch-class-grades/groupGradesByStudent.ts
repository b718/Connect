import { ClassGrades } from "./fetchClassGrades";

type TestGrade = {
  grade: number;
  manualInterventionRequired: boolean;
};

type Students = {
  studentId: string;
  firstName: string;
  lastName: string;
  testGrades: TestGrade[];
};

type Tests = {
  testId: string;
  testName: string;
  viewAnswerKeyUrl: string;
};

export type CategorizedClassGrades = {
  tests: Tests[];
  students: Students[];
};

export function groupGradesByStudent(classGrades: ClassGrades[]) {
  const testIdToTests = new Map<string, Tests>();
  const studentIdToStudents = new Map<string, Students>();
  const processedTestsSet = new Set();

  for (const grade of classGrades) {
    if (!testIdToTests.has(grade.testId)) {
      testIdToTests.set(grade.testId, {
        testId: grade.testId,
        testName: grade.testName,
        viewAnswerKeyUrl: grade.viewAnswerKeyUrl,
      });
    }

    if (!studentIdToStudents.has(grade.studentId)) {
      studentIdToStudents.set(grade.studentId, {
        studentId: grade.studentId,
        firstName: grade.firstName,
        lastName: grade.lastName,
        testGrades: [],
      });
    }
  }

  for (const grade of classGrades) {
    const processedTestsKey = `${grade.studentId}:${grade.testId}`;
    if (!processedTestsSet.has(processedTestsKey)) {
      processedTestsSet.add(processedTestsKey);
      studentIdToStudents.get(grade.studentId)?.testGrades.push({
        grade: grade.testGrade,
        manualInterventionRequired: grade.manualInterventionRequired,
      });
    }
  }

  return {
    tests: Array.from(testIdToTests.values()),
    students: Array.from(studentIdToStudents.values()),
  };
}
