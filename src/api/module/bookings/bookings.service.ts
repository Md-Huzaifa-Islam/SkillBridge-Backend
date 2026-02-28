import { prisma } from "../../../lib/prisma";
import {
  CreateBookingParams,
  UpdateBookingParams,
} from "../../../types/bookings";

const getAllBookingsTutor = async (userId: string) => {
  // Booking.tutorId stores TutorProfile.id, not User.id — look it up first
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) return [];
  return await prisma.booking.findMany({
    where: { tutorId: profile.id },
    include: {
      student: { select: { id: true, name: true, email: true } },
      availableDate: { select: { id: true, day: true } },
      reviews: { select: { id: true, rating: true, review: true } },
    },
    orderBy: { date: "desc" },
  });
};

const getAllBookingsStudent = async (id: string) => {
  return await prisma.booking.findMany({
    where: { studentId: id },
    include: {
      tutor: {
        select: {
          id: true,
          title: true,
          description: true,
          user: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true } },
        },
      },
      availableDate: { select: { id: true, day: true } },
      reviews: { select: { id: true, rating: true, review: true } },
    },
    orderBy: { date: "desc" },
  });
};

const createBooking = async (params: CreateBookingParams) => {
  const {
    availableId,
    date,
    diffHour,
    endTime,
    startTime,
    studentId,
    tutorId,
  } = params;
  const tutor = await prisma.tutorProfile.findUniqueOrThrow({
    where: {
      id: tutorId,
    },
    select: {
      pricePerHour: true,
    },
  });
  return await prisma.booking.create({
    data: {
      date,
      endTime,
      startTime,
      studentId,
      availableId,
      tutorId,
      totalPrice: tutor.pricePerHour * diffHour,
    },
  });
};

const getBookingDetails = async (id: string) => {
  return await prisma.booking.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      date: true,
      startTime: true,
      endTime: true,
      updatedAt: true,
      createdAt: true,
      status: true,

      tutor: {
        select: {
          title: true,
          description: true,
          category: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },

      student: {
        select: {
          name: true,
          email: true,
          role: true,
          status: true,
        },
      },
    },
  });
};

const updateBookingStatus = async (params: UpdateBookingParams) => {
  return await prisma.booking.update({
    data: {
      status: params.status,
    },
    where: {
      id: params.id,
    },
  });
};

const getABooking = async (id: string) => {
  return await prisma.booking.findUnique({
    where: {
      id,
    },
  });
};

const getAllBookingsAdmin = async () => {
  return await prisma.booking.findMany({
    include: {
      student: { select: { id: true, name: true, email: true } },
      tutor: {
        select: {
          id: true,
          title: true,
          user: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true } },
        },
      },
      availableDate: { select: { id: true, day: true } },
    },
    orderBy: { date: "desc" },
  });
};

export const BookingsServices = {
  getAllBookingsTutor,
  getAllBookingsStudent,
  createBooking,
  getBookingDetails,
  updateBookingStatus,
  getABooking,
  getAllBookingsAdmin,
};
