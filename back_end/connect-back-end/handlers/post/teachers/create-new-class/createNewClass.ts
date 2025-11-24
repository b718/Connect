import { getAuth } from "@clerk/express";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type CreateNewClassRequest = {
  courseName: string;
  studentGradeYear: number;
};

type CreateNewClassResponse = {
  statusCode: number;
  message: string;
  classCreated: boolean;
};

function sendResponse(
  statusCode: number,
  message: string,
  classCreated: boolean,
  res: Response
) {
  const response: CreateNewClassResponse = {
    statusCode: statusCode,
    message: message,
    classCreated: classCreated,
  };

  res.status(statusCode).json(response);
}

async function createNewClassQuery(
  databaseClient: PrismaClient,
  courseName: string,
  studentGradeYear: number,
  userId: string
) {
  const createdClass = await databaseClient.$transaction(
    async (transaction) => {
      const newClass = await transaction.classes.create({
        data: {
          courseName: courseName,
          studentGradeYear: studentGradeYear,
          teachers: {
            connect: {
              usersClerkUserId: userId,
            },
          },
        },
      });

      return newClass;
    }
  );

  return createdClass;
}

export default function createNewClass(databaseClient: PrismaClient) {
  const successMessage = "successfully created new class";
  const errorMessage = "unsuccessfully created new class";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const { userId } = getAuth(req);
    const data: CreateNewClassRequest = req.body;

    try {
      if (!userId) {
        logger.info(
          {
            userId: userId,
            courseName: data.courseName,
            courseStudentGradeYear: data.studentGradeYear,
          },
          "user is not authorized to access endpoint"
        );
        return sendResponse(StatusCodes.UNAUTHORIZED, errorMessage, false, res);
      }

      const createdClass = await createNewClassQuery(
        databaseClient,
        data.courseName,
        data.studentGradeYear,
        userId
      );

      logger.info(
        {
          userId: userId,
          courseName: data.courseName,
          courseStudentGradeYear: data.studentGradeYear,
          newClassId: createdClass.classId,
        },
        successMessage
      );

      sendResponse(StatusCodes.OK, successMessage, true, res);
    } catch (error) {
      logger.info(
        {
          userId: userId,
          courseName: data.courseName,
          courseStudentGradeYear: data.studentGradeYear,
          err: error,
        },
        errorMessage
      );

      sendResponse(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, false, res);
    }
  };
}
