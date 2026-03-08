import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import createNewClass from "../../../handlers/post/teachers/create-new-class/createNewClass";
import createTestForClass from "../../../handlers/post/teachers/create-test-for-class/createTestForClass";
import fetchClass from "../../../handlers/get/teachers/fetch-class/fetchClass";
import fetchAllStudentGradesForClass from "../../../handlers/get/teachers/fetch-all-student-grades-for-class/fetchAllStudentGradesForClass";
import patchStudentSubmissionGrade from "../../../handlers/patch/teachers/patch-student-submission-grade/patchStudentSubmissionGrade";
import fetchClasses from "../../../handlers/get/teachers/fetch-classes/fetchClasses";

export default function teacherRouter(databaseClient: PrismaClient) {
  const router = Router();

  //get handlers
  router.get("/classes/:classId", fetchClass(databaseClient));
  router.get("/classes/teacher/:teacherId", fetchClasses(databaseClient));
  router.get(
    "/classes/:classId/grades",
    fetchAllStudentGradesForClass(databaseClient),
  );

  // post handlers
  router.post("/classes/create", createNewClass(databaseClient));
  router.post(
    "/classes/:classId/tests/create",
    createTestForClass(databaseClient),
  );

  // patch handlers
  router.patch(
    "/students/:studentId/tests/:testId/submissions",
    patchStudentSubmissionGrade(databaseClient),
  );

  return router;
}
