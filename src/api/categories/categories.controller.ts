import { Request, Response } from "express";
import { CategoriesService } from "./categories.service";

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoriesService.getAllCategories();

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await CategoriesService.createCategory(name);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const category = await CategoriesService.deleteCategory(id as string);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const CategoriesController = {
  getAllCategories,
  createCategory,
  deleteCategory,
};
