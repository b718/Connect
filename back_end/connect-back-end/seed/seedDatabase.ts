import { PrismaClient } from "@prisma/client";
import getDatabaseClient from "../database/getDatabaseClient";
import pino from "pino";

const sampleTeachers = {
  firstName: "Ms.",
  lastName: "Holman",
  email: "teacher.one@connect.com",
};

const sampleStudents = [
  {
    firstName: "Bryan",
    lastName: "Zhao",
    email: "student.one@connect.com",
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "student.two@connect.com",
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

  try {
    // Create the users first
    const sampleStudentOneUser = await databaseClient.users.create({
      data: {
        clerkUserId: "1",
        email: sampleStudents[0].email,
        firstName: sampleStudents[0].firstName,
        lastName: sampleStudents[0].lastName,
        role: "STUDENT",
      },
    });

    const sampleStudentTwoUser = await databaseClient.users.create({
      data: {
        clerkUserId: "2",
        email: sampleStudents[1].email,
        firstName: sampleStudents[1].firstName,
        lastName: sampleStudents[1].lastName,
        role: "STUDENT",
      },
    });

    const sampleTeacherUser = await databaseClient.users.create({
      data: {
        clerkUserId: "3",
        email: sampleTeachers.email,
        firstName: sampleTeachers.firstName,
        lastName: sampleTeachers.lastName,
        role: "TEACHER",
      },
    });

    // Create the teachers and students first
    const sampleTeacher = await databaseClient.teachers.create({
      data: {
        usersClerkUserId: "3",
        firstName: sampleTeachers.firstName,
        lastName: sampleTeachers.lastName,
      },
    });

    console.log(sampleTeacher);

    const sampleStudentOne = await databaseClient.students.create({
      data: {
        firstName: sampleStudents[0].firstName,
        lastName: sampleStudents[0].lastName,
        usersClerkUserId: sampleStudentOneUser.clerkUserId,
      },
    });

    const sampleStudentTwo = await databaseClient.students.create({
      data: {
        firstName: sampleStudents[1].firstName,
        lastName: sampleStudents[1].lastName,
        usersClerkUserId: sampleStudentTwoUser.clerkUserId,
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
            gradeResultReasoning: "Perfect.",
          },
          {
            testsTableId: sampleTestTwo.testId,
            studentsTableId: sampleStudentOne.studentId,
            testGrade: 0,
            gradeResultReasoning:
              "The provided answer key (Page 558 - Logarithmic and Exponential equations) and the student submission (Page 34 - Systems of Three Linear Equations) are for completely different assignments. As the 'Source of Truth' key does not contain any of the problems or answers found in the student's work, no points can be awarded based on a direct comparison.",
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
            gradeResultReasoning: "Perfect.",
          },
          {
            testsTableId: sampleTestTwo.testId,
            studentsTableId: sampleStudentTwo.studentId,
            testGrade: 55,
            gradeResultReasoning:
              "Suspendisse tristique velit vitae nibh sollicitudin bibendum. Sed at dictum lectus, id suscipit tortor. Aenean dapibus, erat sed commodo aliquet, felis eros vehicula quam, at sodales ante nibh in ligula. Nam dolor mauris, placerat quis sem sed, tempor commodo urna. Vestibulum sed dapibus diam, a imperdiet est. Cras semper eleifend libero sed lobortis. In tempus volutpat tellus, eget efficitur ex aliquam et. Ut laoreet ipsum quis augue bibendum vulputate. In a accumsan justo. Donec sagittis ligula eu nisi euismod ornare. Praesent dignissim nisi magna. In dolor dolor, molestie eu libero suscipit, faucibus condimentum sem. In in porta tortor. Pellentesque vitae ultricies sem. Quisque pharetra tristique arcu pulvinar malesuada. Morbi eget est fringilla, varius enim eget, faucibus quam.",
          },
        ],
      });

    logger.info("successfully inserted seed data");
  } catch (error) {
    logger.error("unsuccessfully inserted seed data: " + error);
  }
}

seedDatabase(getDatabaseClient());
