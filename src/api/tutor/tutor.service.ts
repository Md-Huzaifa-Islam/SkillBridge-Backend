import { prisma } from "../../lib/prisma";
import { WeekDay } from "../../generated/prisma/enums";
import { AppError } from "../../lib/AppError";

interface UpdateProfileData {
  description?: string;
  price_per_hour?: number;
  category_id?: string;
}

interface AvailabilityEntry {
  day: WeekDay;
  start_time: string;
  end_time: string;
}

export class TutorService {
  static async getProfile(userId: string) {
    try {
      const tutorProfile = await prisma.tutorProfile.findFirst({
        where: { user_id: userId },
        include: {
          category: true,
          userToTutor: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          availables: true,
          bookings: {
            include: {
              ratings: true,
            },
          },
        },
      });

      if (!tutorProfile) {
        return null;
      }

      const ratings = tutorProfile.bookings
        .filter((b) => b.ratings)
        .map((b) => b.ratings!.rating);
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : null;

      return {
        ...tutorProfile,
        averageRating,
      };
    } catch (error: any) {
      console.error("Error in getProfile service:", error);
      throw error;
    }
  }

  static async getSessions(userId: string) {
    try {
      const tutorProfile = await prisma.tutorProfile.findFirst({
        where: { user_id: userId },
      });

      if (!tutorProfile) {
        const error: any = new AppError("Tutor profile not found", 404);
        throw error;
      }

      const sessions = await prisma.booking.findMany({
        where: { tutor_id: tutorProfile.id },
        include: {
          bookingStudent: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          bookingTutor: {
            include: {
              category: true,
              userToTutor: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          ratings: true,
        },
        orderBy: {
          date: "desc",
        },
      });

      return sessions;
    } catch (error: any) {
      console.error("Error in getSessions service:", error);
      throw error;
    }
  }

  static async updateProfile(userId: string, data: UpdateProfileData) {
    try {
      let tutorProfile = await prisma.tutorProfile.findFirst({
        where: { user_id: userId },
      });

      if (!tutorProfile) {
        if (!data.category_id || !data.price_per_hour) {
          const error: any = new Error(
            "category_id and price_per_hour are required to create a tutor profile",
          );
          error.statusCode = 400;
          throw error;
        }

        const category = await prisma.category.findUnique({
          where: { id: data.category_id },
        });

        if (!category) {
          const error: any = new Error("Category not found");
          error.statusCode = 404;
          throw error;
        }

        tutorProfile = await prisma.tutorProfile.create({
          data: {
            user_id: userId,
            category_id: data.category_id,
            price_per_hour: data.price_per_hour,
            description: data.description || null,
          },
          include: {
            category: true,
            userToTutor: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        });

        return tutorProfile;
      }

      if (data.category_id) {
        const category = await prisma.category.findUnique({
          where: { id: data.category_id },
        });

        if (!category) {
          const error: any = new Error("Category not found");
          error.statusCode = 404;
          throw error;
        }
      }

      const updateData: any = {};
      if (data.description !== undefined)
        updateData.description = data.description;
      if (data.price_per_hour !== undefined)
        updateData.price_per_hour = data.price_per_hour;
      if (data.category_id !== undefined)
        updateData.category_id = data.category_id;

      const updatedProfile = await prisma.tutorProfile.update({
        where: { id: tutorProfile.id },
        data: updateData,
        include: {
          category: true,
          userToTutor: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return updatedProfile;
    } catch (error: any) {
      console.error("Error in updateProfile service:", error);
      throw error;
    }
  }

  static async updateAvailability(
    userId: string,
    availability: AvailabilityEntry[],
  ) {
    try {
      const tutorProfile = await prisma.tutorProfile.findFirst({
        where: { user_id: userId },
      });

      if (!tutorProfile) {
        const error: any = new Error("Tutor profile not found for this user");
        error.statusCode = 404;
        throw error;
      }

      await prisma.available.deleteMany({
        where: { tutor_id: tutorProfile.id },
      });

      const availabilityData = availability.map((avail) => ({
        tutor_id: tutorProfile.id,
        day: avail.day,
        start_time: new Date(`1970-01-01T${avail.start_time}`),
        end_time: new Date(`1970-01-01T${avail.end_time}`),
      }));

      const createdAvailability = await prisma.available.createMany({
        data: availabilityData,
      });

      const updatedAvailability = await prisma.available.findMany({
        where: { tutor_id: tutorProfile.id },
      });

      return updatedAvailability;
    } catch (error: any) {
      console.error("Error in updateAvailability service:", error);
      throw error;
    }
  }
}
