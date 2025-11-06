import { Classes, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type GetClassesResponse = {
  statusCode: number;
  message: string;
  data: Classes[];
};

function createGetClassesResponse(
  statusCode: number,
  message: string,
  data: Classes[],
  res: Response
) {
  const response: GetClassesResponse = {
    statusCode: statusCode,
    message: message,
    data: data,
  };

  res.status(statusCode).json(response);
}

async function getClassesQuery(databaseClient: PrismaClient) {
  const classes = await databaseClient.classes.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return classes;
}

export default function getClasses(databaseClient: PrismaClient) {
  const successMessage = "successfully queried all classes";
  const errorMessage = "unsuccessfully queried all classes";
  const logger = pino({
    name: "handlers/get-classes/getClasses.ts",
  });

  return async function (req: Request, res: Response) {
    try {
      const classes = await getClassesQuery(databaseClient);
      logger.info(successMessage);

      createGetClassesResponse(StatusCodes.OK, successMessage, classes, res);
    } catch (error) {
      logger.error({
        error: error,
        message: errorMessage,
      });

      createGetClassesResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        [],
        res
      );
    }
  };
}
