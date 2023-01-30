import { Request, Response, NextFunction } from "express";
import HttpError from "../models/http-error.model";

const errorHandlerMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode: number = 500;
  let message: string = "Something went wrong!";

  if (error instanceof HttpError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json({
    message,
    statusCode,
  });
};

export default errorHandlerMiddleware;
