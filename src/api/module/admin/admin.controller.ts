import { NextFunction, Request, Response } from "express";
import { AdminServices } from "./admin.service";
import { sendResponse } from "../../../middleware/response.middleware";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, status, search, page, size } = req.query;
    const result = await AdminServices.getUsers({
      role: role as string | undefined,
      status: status as string | undefined,
      search: search as string | undefined,
      page: page ? Number(page) : 1,
      size: size ? Number(size) : 20,
    });
    sendResponse(res, { message: "Users fetched.", data: result });
  } catch (error) {
    next(error);
  }
};

const getUserDetail = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400);
      throw new Error("User id is required.");
    }
    const result = await AdminServices.getUserDetail(id);
    sendResponse(res, { message: "User detail fetched.", data: result });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!id) {
      res.status(400);
      throw new Error("User id is required.");
    }
    if (!status || !["active", "banned"].includes(status)) {
      res.status(400);
      throw new Error("Status must be 'active' or 'banned'.");
    }
    const result = await AdminServices.updateUserStatus(id, status);
    sendResponse(res, {
      message: status === "banned" ? "User banned." : "User unbanned.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminControllers = { getUsers, getUserDetail, updateUser };
