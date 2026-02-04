import { prisma } from "../../lib/prisma";
import { WeekDay } from "../../generated/prisma/enums";

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
  static async updateProfile(userId: string, data: UpdateProfileData) {
    try {
      // First, find the tutor profile for this user
      const tutorProfile = await prisma.tutorProfile.findFirst({
        where: { user_id: userId },
      });

      if (!tutorProfile) {
        const error: any = new Error("Tutor profile not found for this user");
        error.statusCode = 404;
        throw error;
      }

      // If category_id is provided, verify it exists
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

      // Update the tutor profile
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
      // First, find the tutor profile for this user
      const tutorProfile = await prisma.tutorProfile.findFirst({
        where: { user_id: userId },
      });

      if (!tutorProfile) {
        const error: any = new Error("Tutor profile not found for this user");
        error.statusCode = 404;
        throw error;
      }

      // Delete existing availability for this tutor
      await prisma.available.deleteMany({
        where: { tutor_id: tutorProfile.id },
      });

      // Create new availability entries
      const availabilityData = availability.map((avail) => ({
        id: crypto.randomUUID(),
        tutor_id: tutorProfile.id,
        day: avail.day,
        start_time: new Date(`1970-01-01T${avail.start_time}`),
        end_time: new Date(`1970-01-01T${avail.end_time}`),
      }));

      const createdAvailability = await prisma.available.createMany({
        data: availabilityData,
      });

      // Fetch and return the updated availability
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
