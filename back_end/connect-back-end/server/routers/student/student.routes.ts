import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import fetchStudentClasses from "../../../handlers/get/students/fetch-student-classes/fetchStudentClasses";
import fetchStudentClass from "../../../handlers/get/students/fetch-student-class/fetchStudentClass";
import fetchStudentClassGrades from "../../../handlers/get/students/fetch-student-class-grades/fetchStudentClassGrades";

export default function studentRouter(databaseClient: PrismaClient) {
  const router = Router();

  //get handlers
  router.get("/classes", fetchStudentClasses(databaseClient));
  router.get("/classes/:classId", fetchStudentClass(databaseClient));
  router.get(
    "/classes/:classId/grades",
    fetchStudentClassGrades(databaseClient)
  );

  return router;
}
