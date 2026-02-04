import { prisma } from "../../lib/prisma";

interface CreateReviewData {
  booking_id: string;
  rating: number;
  review?: string;
}

export class ReviewsService {
  static async createReview(studentId: string, data: CreateReviewData) {
    try {
      // First, verify the booking exists and belongs to this student
      const booking = await prisma.booking.findUnique({
        where: { id: data.booking_id },
        include: {
          ratings: true,
        },
      });

      if (!booking) {
        const error: any = new Error("Booking not found");
        error.statusCode = 404;
        throw error;
      }

      // Verify the booking belongs to this student
      if (booking.student_id !== studentId) {
        const error: any = new Error("You can only review your own bookings");
        error.statusCode = 403;
        throw error;
      }

      // Check if the booking is completed
      if (booking.status !== "completed") {
        const error: any = new Error("You can only review completed bookings");
        error.statusCode = 400;
        throw error;
      }

      // Check if a review already exists for this booking
      if (booking.ratings) {
        const error: any = new Error(
          "A review already exists for this booking",
        );
        error.statusCode = 409;
        throw error;
      }

      // Create the review
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
