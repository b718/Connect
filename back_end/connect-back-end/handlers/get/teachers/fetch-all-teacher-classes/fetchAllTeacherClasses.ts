import { PrismaClient, Teachers } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type TeacherClasses = {
  classId: string;
  courseName: string;
  studentGradeYear: number;
  createdAt: Date;
  teachers: Teachers[];
};

type FetchAllTeacherClassesResponse = {
  statusCode: number;
  message: string;
  data: TeacherClasses[];
};

export default function fetchAllTeacherClasses(databaseClient: PrismaClient) {
  const successMessage = "successfully queried all teacher classes";
  const errorMessage = "unsuccessfully queried all teacher classes";
  const logger = pino({ name: __filename });

  return async function (_req: Request, res: Response) {
    try {
      const classes = await fetchAllClassesQuery(databaseClient);
      logger.info({ totalClasses: classes.length }, successMessage);

      createResponse(StatusCodes.OK, successMessage, classes, res);
    } catch (error) {
      logger.error({ err: error }, errorMessage);

      createResponse(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, [], res);
    }
  };
}

function createResponse(
  statusCode: number,
  message: string,
  data: TeacherClasses[],
  res: Response
) {
  const response: FetchAllTeacherClassesResponse = {
    statusCode: statusCode,
    message: message,
    data: data,
  };

  res.status(statusCode).json(response);
}

async function fetchAllClassesQuery(databaseClient: PrismaClient) {
  const classes = await databaseClient.classes.findMany({
    include: {
      teachers: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return classes;
}
