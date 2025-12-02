import { PrismaClient, Students, Teachers } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type GetClassInformationResponse = {
  statusCode: number;
  message: string;
  data: {
    courseName: string;
    studentGradeYear: number;
    teachers: Teachers[];
    students: Students[];
  };
};

function createGetClassInformationResponse(
  statusCode: number,
  message: string,
  data: any,
  res: Response
) {
  const response: GetClassInformationResponse = {
    statusCode: statusCode,
    message: message,
    data: data,
  };

  res.status(statusCode).json(response);
}

async function getClassInformationQuery(
  databaseClient: PrismaClient,
  classId: string
) {
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

export default function getClassInformation(databaseClient: PrismaClient) {
  const successMessage =
    "successfully queried all students and teachers for a specific class";
  const errorMessage =
    "unsuccessfully queried all students and teachers for a specific class";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const classId = req.params.classId;

    try {
      const classInformation = await getClassInformationQuery(
        databaseClient,
        classId
      );

      logger.info({
        message: successMessage,
        classId: classId,
      });

      createGetClassInformationResponse(
        StatusCodes.OK,
        successMessage,
        classInformation,
        res
      );
    } catch (error) {
      logger.error({
        classId: classId,
        error: error,
        message: errorMessage,
      });

      createGetClassInformationResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        [],
        res
      );
    }
  };
}
