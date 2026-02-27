// Get tutor profile by userId (for /me endpoint)
const getTutorProfileByUserId = async (userId: string) => {
  return await prisma.tutorProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      active: true,
      title: true,
      description: true,
      startTime: true,
      endTime: true,
      pricePerHour: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      availabilities: {
        select: {
          day: true,
          id: true,
        },
      },
    },
  });
};
import { WeekDay } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import {
  CreateATutorParams,
  GetAllTutorsParams,
  UpdateTutorParams,
} from "../../../types/tutors";

const createTutor = async (params: CreateATutorParams) => {
  return await prisma.tutorProfile.create({
    data: params,
  });
};

const getAllTutor = async (params: GetAllTutorsParams) => {
  const { skip, sortBy, sortOrder, take, category, search } = params;
  const where: any = {};
  if (category) {
    where.categoryId = category;
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  const result = await prisma.tutorProfile.findMany({
    skip,
    take,
    orderBy: { [sortOrder]: sortBy },
    where,
  });
  const total = await prisma.tutorProfile.count({ where });
  return {
    total,
    pages: Math.ceil(total / take),
    data: result,
  };
};

const getATutorDetails = async (id: string) => {
  const result = await prisma.tutorProfile.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      active: true,
      title: true,
      description: true,
      startTime: true,
      endTime: true,
      pricePerHour: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      availabilities: {
        select: {
          day: true,
          id: true,
        },
      },
    },
  });

  const avgRating = await prisma.review.aggregate({
    _avg: { rating: true },
    where: { booking: { tutorId: id } },
  });
  return {
    ...result,
    avgRating,
  };
};

const updateAvailable = async ({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) => {
  return await prisma.tutorProfile.update({
    where: { userId: id },
    data: {
      active,
    },
  });
};

const updateTutor = async (params: UpdateTutorParams) => {
  const { userId, ...payload } = params;
  return await prisma.tutorProfile.update({
    data: payload,
    where: { userId },
  });
};

const getRatings = async (id: string) => {
  return await prisma.review.findMany({
    where: { booking: { tutorId: id } },
    select: {
      id: true,
      review: true,
      rating: true,
      createdAt: true,
      updatedAt: true,
      booking: {
        select: {
          student: {
            select: {
              name: true,
              image: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

const updateSlotTutor = async ({
  id,
  days,
}: {
  id: string;
  days: WeekDay[];
}) => {
  return await prisma.$transaction(async (tx) => {
    // Delete availabilities that were unchecked AND have no bookings attached.
    // We cannot delete ones with existing bookings due to the FK constraint.
    await tx.available.deleteMany({
      where: {
        tutorId: id,
        day: { notIn: days },
        bookings: { none: {} },
      },
    });

    // Add any newly checked days (skip if already exist).
    if (days.length > 0) {
      await tx.available.createMany({
        data: days.map((d) => ({ tutorId: id, day: d })),
        skipDuplicates: true,
      });
    }
  });
};

export const TutorsServices = {
  createTutor,
  getAllTutor,
  getATutorDetails,
  getTutorProfileByUserId,
  updateTutor,
  updateAvailable,
  getRatings,
  updateSlotTutor,
};
