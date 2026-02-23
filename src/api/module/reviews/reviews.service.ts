import { prisma } from "../../../lib/prisma";
import { CreateReviewParams, UpdateReviewParams } from "../../../types/reviews";

const getReviews = async (id: string) => {
  return await prisma.booking.findMany({
    include: {
      student: {
        select: {
          id: true,
          name: true,
        },
      },
      reviews: {
        select: {
          id: true,
          review: true,
          rating: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    where: {
      id,
    },
  });
};

const createReviews = async (params: CreateReviewParams) => {
  return await prisma.review.create({
    data: {
      bookingId: params.bookingId,
      rating: params.rating,
      review: params.review || null,
    },
  });
};

const updateReviews = async (params: UpdateReviewParams) => {
  const { reviewId, rating, review } = params;

  const updateData: { rating?: number; review?: string } = {};
  if (rating) {
    updateData.rating = rating;
  }
  if (review) {
    updateData.review = review;
  }

  return await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: updateData,
  });
};

const deleteReviews = async (reviewId: string) => {
  return await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });
};

const getBooking = async (id: string) => {
  return await prisma.booking.findUnique({
    where: {
      id,
    },
  });
};

export const ReviewsServices = {
  getReviews,
  createReviews,
  updateReviews,
  deleteReviews,
  getBooking,
};
