import { StudentGrades } from "./fetchStudentGradesForClass";

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

export type CategorizedTests = {
  tests: Tests[];
  students: Students[];
};

export function categorizeTestsForStudents(studentGrades: StudentGrades[]) {
  const testIdToTests = new Map<string, Tests>();
  const studentIdToStudents = new Map<string, Students>();
  const processedTestsSet = new Set();

  for (const grade of studentGrades) {
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

  for (const grade of studentGrades) {
    const processedTestsKey = `${grade.studentId}:${grade.testId}`;
    if (!processedTestsSet.has(processedTestsKey)) {
      processedTestsSet.add(processedTestsKey);
      studentIdToStudents.get(grade.studentId)?.testGrades.push({
        grade: grade.testGrade,
        manualInterventionRequired: grade.manualInterventionRequired,
      });
    }
  }

  const categorizedStudents: CategorizedTests = {
    tests: Array.from(testIdToTests.values()),
    students: Array.from(studentIdToStudents.values()),
  };

  return categorizedStudents;
}
