import { prisma } from "../../lib/prisma";
import { AppError } from "../../lib/AppError";

interface CreateReviewData {
  booking_id: string;
  rating: number;
  review?: string;
}

export class ReviewsService {
  static async createReview(studentId: string, data: CreateReviewData) {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: data.booking_id },
        include: {
          ratings: true,
        },
      });

      if (!booking) {
        throw new AppError("Booking not found", 404);
      }

      if (booking.student_id !== studentId) {
        throw new AppError("You can only review your own bookings", 403);
      }

      if (booking.status !== "completed") {
        throw new AppError("You can only review completed bookings", 400);
      }

      if (booking.ratings) {
        throw new AppError("A review already exists for this booking", 409);
      }

      const createdReview = await prisma.rating.create({
        data: {
          booking_id: data.booking_id,
          rating: data.rating,
          review: data.review,
        },
        include: {
          bookingRating: {
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
            },
          },
        },
      });

      return createdReview;
    } catch (error: any) {
      console.error("Error in createReview service:", error);
      throw error;
    }
  }
}
