import { prisma } from "../../lib/prisma";
import { UsersRole } from "../../generated/prisma/enums";

interface UpdateUserStatusData {
  is_banned?: boolean;
  role?: UsersRole;
}

export class AdminService {
  static async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          is_banned: true,
          createdAt: true,
          updatedAt: true,
          tutorProfiles: {
            select: {
              id: true,
              category_id: true,
              description: true,
              price_per_hour: true,
              featured: true,
            },
          },
          bookings: {
            select: {
              id: true,
              status: true,
              total_price: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return users;
    } catch (error: any) {
      console.error("Error in getAllUsers service:", error);
      throw error;
    }
  }

  static async updateUserStatus(userId: string, data: UpdateUserStatusData) {
    try {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        const error: any = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      // Build update data
      const updateData: any = {};
      if (data.is_banned !== undefined) updateData.is_banned = data.is_banned;
      if (data.role !== undefined) updateData.role = data.role;

      // Update user status
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          is_banned: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    } catch (error: any) {
      console.error("Error in updateUserStatus service:", error);
      throw error;
    }
  }
}
