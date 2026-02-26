import { Response } from "express";

type ResponseData<T = any> = {
  success?: boolean;
  message?: string;
  data?: T | null;
};

export const sendResponse = <T>(
  res: Response,
  { success = true, message = "", data = null }: ResponseData<T>,
  statusCode: number = 200,
) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};
