import { Category } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllCategories = async (): Promise<Category[]> => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return categories;
};

const createCategory = async (name: string): Promise<Category> => {
  const category = await prisma.category.create({
    data: {
      name,
    },
  });
  return category;
};

const deleteCategory = async (id: string): Promise<Category> => {
  const category = await prisma.category.delete({
    where: { id },
  });
  return category;
};

export const CategoriesService = {
  getAllCategories,
  createCategory,
  deleteCategory,
};
