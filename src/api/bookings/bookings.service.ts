import { Prisma } from "../../generated/prisma/client";
import {
  buildPaginationResponse,
  calculatePagination,
} from "../../lib/pagination";
import { prisma } from "../../lib/prisma";

interface CreateBookingInput {
  student_id: string;
  tutor_id: string;
  start_time: string;
  end_time: string;
  date: string;
}

interface GetBookingsQuery {
  page?: string;
  limit?: string;
  status?: string;
}

const createBooking = async (data: CreateBookingInput) => {
  const { student_id, tutor_id, start_time, end_time, date } = data;

  // Get tutor profile to calculate price
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: tutor_id },
    select: { price_per_hour: true },
  });

  if (!tutorProfile) {
    throw new Error("Tutor not found");
  }

  const startHour = new Date(`1970-01-01T${start_time}`).getHours();
  const endHour = new Date(`1970-01-01T${end_time}`).getHours();
  const hours = endHour - startHour;
  const total_price = hours * tutorProfile.price_per_hour;

  // Generate a unique ID (you might want to use a UUID library)
  const id = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const booking = await prisma.booking.create({
    data: {
      id,
      student_id,
      tutor_id,
      start_time: new Date(`1970-01-01T${start_time}`),
      end_time: new Date(`1970-01-01T${end_time}`),
      date: new Date(`1970-01-01T${date}`),
      total_price,
      status: "confirm",
    },
    include: {
      bookingTutor: {
        include: {
          userToTutor: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          category: true,
        },
      },
      bookingStudent: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return booking;
};

const getUserBookings = async (
  userId: string,
  userRole: string | undefined,
  query: GetBookingsQuery,
) => {
  const { page, limit, status } = query;

  // Calculate pagination
  const {
    page: currentPage,
    limit: pageLimit,
    skip,
  } = calculatePagination({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  });

  // Build where clause based on user role
  const where: Prisma.BookingWhereInput = {};

  if (userRole === "student") {
    where.student_id = userId;
  } else if (userRole === "teacher") {
    where.bookingTutor = {
      user_id: userId,
    };
  }
  // Admin can see all bookings, so no filter needed

  // Add status filter if provided
  if (status) {
    where.status = status as any;
  }

  // Fetch bookings with count
  const [bookings, total] = await prisma.$transaction([
    prisma.booking.findMany({
      where,
      skip,
      take: pageLimit,
      orderBy: {
        date: "desc",
      },
      include: {
        bookingTutor: {
          include: {
            userToTutor: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
            category: true,
          },
        },
        bookingStudent: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        ratings: true,
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return buildPaginationResponse(bookings, total, currentPage, pageLimit);
};

const getBookingDetails = async (
  bookingId: string,
  userId: string,
  userRole: string | undefined,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      bookingTutor: {
        include: {
          userToTutor: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          category: true,
          availables: true,
        },
      },
      bookingStudent: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      ratings: true,
    },
  });

  if (!booking) {
    return null;
  }

  // Check if user has permission to view this booking
  if (userRole === "student" && booking.student_id !== userId) {
    throw new Error("You don't have permission to view this booking");
  }

  if (userRole === "teacher" && booking.bookingTutor.user_id !== userId) {
    throw new Error("You don't have permission to view this booking");
  }

  return booking;
};

export const BookingsService = {
  createBooking,
  getUserBookings,
  getBookingDetails,
};
