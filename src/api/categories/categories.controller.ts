import { Request, Response } from "express";
import { CategoriesService } from "./categories.service";
import { catchAsync } from "../../lib/asyncHandler";
import { AppError } from "../../lib/AppError";

const getAllCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await CategoriesService.getAllCategories();

  res.status(200).json({
    success: true,
    message: "Categories retrieved successfully",
    data: categories,
  });
});

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  const category = await CategoriesService.createCategory(name);

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!id) throw new AppError("Category ID is required", 400);

  const category = await CategoriesService.deleteCategory(id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: category,
  });
});

export const CategoriesController = {
  getAllCategories,
  createCategory,
  deleteCategory,
};
