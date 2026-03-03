import { Response } from "express";

export default function sendResponse<T>(
  res: Response,
  statusCode: number,
  responseData: T,
) {
  res.status(statusCode).json(responseData);
}
