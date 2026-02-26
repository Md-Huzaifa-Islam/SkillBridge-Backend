import { prisma } from "../../../lib/prisma";

const getCategories = async () => {
  return await prisma.category.findMany();
};

const createCategory = async (name: string) => {
  return await prisma.category.create({
    data: {
      name,
    },
  });
};

const updateCategory = async ({ name, id }: { name: string; id: string }) => {
  return await prisma.category.update({
    data: {
      name,
    },
    where: {
      id,
    },
  });
};

const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
  });
};

const getCategoryByName = async (name: string) => {
  return await prisma.category.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });
};

const getCategoryById = async (id: string) => {
  return await prisma.category.findUnique({ where: { id } });
};

const countTutorProfilesByCategory = async (categoryId: string) => {
  return await prisma.tutorProfile.count({ where: { categoryId } });
};

export const CategoriesServices = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryByName,
  getCategoryById,
  countTutorProfilesByCategory,
};
