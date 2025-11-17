import { getAuth } from "@clerk/express";
import { Classes, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type FetchStudentClassResponse = {
  statusCode: number;
  message: string;
  data: Classes | null;
};

function createFetchStudentClassResponse(
  statusCode: number,
  message: string,
  data: Classes | null,
  res: Response
) {
  const response: FetchStudentClassResponse = {
    statusCode: statusCode,
    message: message,
    data: data,
  };

  res.status(statusCode).json(response);
}

async function fetchStudentClassQuery(
  databaseClient: PrismaClient,
  classId: string
) {
  const studentClass = await databaseClient.classes.findUnique({
    where: {
      classId: classId,
    },
  });

  return studentClass;
}

export default function fetchStudentClass(databaseClient: PrismaClient) {
  const successMessage = "successfully fetched student class";
  const errorMessage = "unsuccessfully fetched student class";
  const logger = pino({
    name: "handlers/get/students/fetch-student-class/fetchStudentClass.ts",
  });

  return async function (req: Request, res: Response) {
    const { userId } = getAuth(req);
    const { classId } = req.params;

    try {
      if (!userId) {
        logger.info(
          { classId: classId },
          "user is not authorized to access endpoint"
        );
        return createFetchStudentClassResponse(
          StatusCodes.UNAUTHORIZED,
          errorMessage,
          null,
          res
        );
      }

      const studentClass = await fetchStudentClassQuery(
        databaseClient,
        classId
      );

      logger.info(
        {
          userId: userId,
          classId: classId,
        },
        successMessage
      );

      createFetchStudentClassResponse(
        StatusCodes.OK,
        successMessage,
        studentClass,
        res
      );
    } catch (error) {
      logger.error(
        { userId: userId, classId: classId, err: error },
        errorMessage
      );

      createFetchStudentClassResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        null,
        res
      );
    }
  };
}
