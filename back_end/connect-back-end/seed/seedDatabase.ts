import { PrismaClient } from "@prisma/client";
import getDatabaseClient from "../database/getDatabaseClient";
import pino from "pino";

const sampleTeachers = {
  firstName: "Ms.",
  lastName: "Holman",
};

const sampleStudents = [
  {
    firstName: "Bryan",
    lastName: "Zhao",
  },
  {
    firstName: "John",
    lastName: "Doe",
  },
];

const sampleClass = {
  courseName: "Pre-Calculus 12",
  studentGradeYear: 12,
};

const sampleTests = [
  {
    testName: "Polynomial Functions Test",
  },
  {
    testName: "Factorization Test",
  },
];

async function seedDatabase(databaseClient: PrismaClient) {
  const logger = pino({
    name: "connected-back-end/seed/seedDatabase.ts",
  });

  // Create the teachers and students first
  try {
    const sampleTeacher = await databaseClient.teachers.create({
      data: {
        firstName: sampleTeachers.firstName,
        lastName: sampleTeachers.lastName,
      },
    });

    const sampleStudentOne = await databaseClient.students.create({
      data: {
        firstName: sampleStudents[0].firstName,
        lastName: sampleStudents[0].lastName,
      },
    });

    const sampleStudentTwo = await databaseClient.students.create({
      data: {
        firstName: sampleStudents[1].firstName,
        lastName: sampleStudents[1].lastName,
      },
    });

    // Now we can create the classes
    const sampleClassOne = await databaseClient.classes.create({
      data: {
        courseName: sampleClass.courseName,
        studentGradeYear: sampleClass.studentGradeYear,

        students: {
          connect: [
            { studentId: sampleStudentOne.studentId },
            { studentId: sampleStudentTwo.studentId },
          ],
        },

        teachers: {
          connect: { teacherId: sampleTeacher.teacherId },
        },
      },
    });

    // Now we can create a sample test
    const sampleTestOne = await databaseClient.tests.create({
      data: {
        testName: sampleTests[0].testName,

        classesTableId: sampleClassOne.classId,
      },
    });

    const sampleTestTwo = await databaseClient.tests.create({
      data: {
        testName: sampleTests[1].testName,

        classesTableId: sampleClassOne.classId,
      },
    });

    console.log(sampleTestOne);
    console.log(sampleTestTwo);

    // Now we can create the test results
    const sampleStudentOneTestResult =
      await databaseClient.studentTestResults.createMany({
        data: [
          {
            testsTableId: sampleTestOne.testId,
            studentsTableId: sampleStudentOne.studentId,
            testGrade: 95,
          },
          {
            testsTableId: sampleTestTwo.testId,
            studentsTableId: sampleStudentOne.studentId,
            testGrade: 69,
          },
        ],
      });

    const sampleStudentTwoTestResult =
      await databaseClient.studentTestResults.createMany({
        data: [
          {
            testsTableId: sampleTestOne.testId,
            studentsTableId: sampleStudentTwo.studentId,
            testGrade: 93,
          },
          {
            testsTableId: sampleTestTwo.testId,
            studentsTableId: sampleStudentTwo.studentId,
            testGrade: 95,
          },
        ],
      });

    logger.info("successfully inserted seed data");
  } catch (error) {
    logger.error("unsuccessfully inserted seed data: " + error);
  }
}

seedDatabase(getDatabaseClient());
