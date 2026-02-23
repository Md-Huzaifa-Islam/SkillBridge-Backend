import { prisma } from "../../../lib/prisma";
import {
  CreateBookingParams,
  UpdateBookingParams,
} from "../../../types/bookings";

const getAllBookingsTutor = async (id: string) => {
  return await prisma.booking.findMany({
    where: {
      tutorId: id,
    },
  });
  // return result
};

const getAllBookingsStudent = async (id: string) => {
  return await prisma.booking.findMany({
    where: {
      studentId: id,
    },
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

export const BookingsServices = {
  getAllBookingsTutor,
  getAllBookingsStudent,
  createBooking,
  getBookingDetails,
  updateBookingStatus,
  getABooking,
};
