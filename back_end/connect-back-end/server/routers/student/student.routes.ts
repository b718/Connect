import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { SQSClient } from "@aws-sdk/client-sqs";
import fetchStudentClasses from "../../../handlers/get/students/fetch-student-classes/fetchStudentClasses";
import fetchStudentClass from "../../../handlers/get/students/fetch-student-class/fetchStudentClass";
import fetchStudentClassGrades from "../../../handlers/get/students/fetch-student-class-grades/fetchStudentClassGrades";
import createStudentRegistrationForClass from "../../../handlers/post/students/create-student-registration-for-class/createStudentRegistrationForClass";
import fetchStudentSubmissionUploadLink from "../../../handlers/get/students/fetch-student-submission-upload-link/fetchStudentSubmissionUploadLink";
import publishStudentSubmissionEvent from "../../../handlers/post/students/mark-test-for-class/publish/publishStudentSubmissionEvent";

export default function studentRouter(databaseClient: PrismaClient) {
  const studentSubmissionQueueClient = new SQSClient({});
  const router = Router();

  //get handlers
  router.get("/classes", fetchStudentClasses(databaseClient));
  router.get("/classes/:classId", fetchStudentClass(databaseClient));
  router.get(
    "/classes/:classId/grades",
    fetchStudentClassGrades(databaseClient)
  );
  router.get(
    "/classes/:classId/students/:studentId/tests/:testId/grade",
    fetchStudentSubmissionUploadLink()
  );

  //post handlers
  router.post(
    "/classes/:classId/students/:studentId/join/class",
    createStudentRegistrationForClass(databaseClient)
  );
  router.post(
    "/classes/:classId/students/:studentId/tests/:testId/grade",
    publishStudentSubmissionEvent(databaseClient, studentSubmissionQueueClient)
  );

  return router;
}
