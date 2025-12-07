import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import createNewClass from "../../../handlers/post/teachers/create-new-class/createNewClass";
import fetchAllTeacherClasses from "../../../handlers/get/teachers/fetch-all-teacher-classes/fetchAllTeacherClasses";
import createTestForClass from "../../../handlers/post/teachers/create-test-for-class/createTestForClass";
import fetchClass from "../../../handlers/get/teachers/fetch-class/fetchClass";
import fetchAllStudentGradesForClass from "../../../handlers/get/teachers/fetch-all-student-grades-for-class/fetchAllStudentGradesForClass";
import patchStudentSubmissionGrade from "../../../handlers/patch/teachers/patch-student-submission-grade/patchStudentSubmissionGrade";

export default function teacherRouter(databaseClient: PrismaClient) {
  const router = Router();

  //get handlers
  router.get("/classes", fetchAllTeacherClasses(databaseClient));
  router.get("/classes/:classId", fetchClass(databaseClient));
  router.get(
    "/classes/:classId/grades",
    fetchAllStudentGradesForClass(databaseClient)
  );

  // post handlers
  router.post("/classes/create", createNewClass(databaseClient));
  router.post(
    "/classes/:classId/tests/create",
    createTestForClass(databaseClient)
  );

  // patch handlers
  router.patch(
    "/students/:studentId/tests/:testId/submissions",
    patchStudentSubmissionGrade(databaseClient)
  );

  return router;
}
