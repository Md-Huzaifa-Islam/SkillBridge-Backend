import { NextFunction, Request, Response } from "express";
import { CategoriesServices } from "./categories.service";
import { sendResponse } from "../../../middleware/response.middleware";

const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await CategoriesServices.getCategories();
    sendResponse(res, { message: "All category fetched", data: result });
  } catch (error: any) {
    next(error);
  }
};

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const name = req.body?.name?.trim();
    if (!name) {
      res.status(400);
      throw new Error("Category name is required.");
    }
    const existing = await CategoriesServices.getCategoryByName(name);

    if (existing?.id) {
      res.status(409);
      throw new Error("Category name is already taken.");
    }

    const result = await CategoriesServices.createCategory(name);
    sendResponse(res, { message: "Category created successfully." }, 201);
  } catch (error: any) {
    next(error);
  }
};

const updateCategory = async (
  req: Request<{ id: string; name: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const name = req.body?.name?.trim();
    const id = req.params?.id;

    if (!id) {
      res.status(400);
      throw new Error("ID is missing.");
    }
    if (!name) {
      res.status(400);
      throw new Error("Category name is required.");
    }
    const existing = await CategoriesServices.getCategoryByName(name);

    if (existing?.id) {
      res.status(409);
      throw new Error("Category name is already taken.");
    }
    await CategoriesServices.updateCategory({ name, id });

    sendResponse(res, { message: "Category name updated successfully." });
  } catch (error: any) {
    next(error);
  }
};

const deleteCategory = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params?.id;

    if (!id) {
      res.status(400);
      throw new Error("ID is missing.");
    }

    await CategoriesServices.deleteCategory(id);
    sendResponse(res, { message: "Category deleted successfully." });
  } catch (error: any) {
    next(error);
  }
};

export const CategoriesControllers = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
