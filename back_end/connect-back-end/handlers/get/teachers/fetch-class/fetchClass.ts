import { PrismaClient, Students, Teachers } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type FetchClassResponse = {
  statusCode: number;
  message: string;
  data: {
    courseName: string;
    studentGradeYear: number;
    teachers: Teachers[];
    students: Students[];
  };
};

export default function fetchClass(databaseClient: PrismaClient) {
  const successMessage =
    "successfully queried all students and teachers for a specific class";
  const errorMessage =
    "unsuccessfully queried all students and teachers for a specific class";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const classId = req.params.classId;

    try {
      const classInformation = await fetchClassQuery(databaseClient, classId);
      logger.info({ classId: classId }, successMessage);

      createResponse(StatusCodes.OK, successMessage, classInformation, res);
    } catch (error) {
      logger.error({ classId: classId, err: error }, errorMessage);

      createResponse(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, [], res);
    }
  };
}

function createResponse(
  statusCode: number,
  message: string,
  data: any,
  res: Response
) {
  const response: FetchClassResponse = {
    statusCode: statusCode,
    message: message,
    data: data,
  };

  res.status(statusCode).json(response);
}

async function fetchClassQuery(databaseClient: PrismaClient, classId: string) {
  const classInformation = await databaseClient.classes.findUnique({
    where: {
      classId: classId,
    },
    select: {
      courseName: true,
      studentGradeYear: true,
      students: true,
      teachers: true,
    },
  });

  if (!classInformation) {
    return [];
  }

  return classInformation;
}
