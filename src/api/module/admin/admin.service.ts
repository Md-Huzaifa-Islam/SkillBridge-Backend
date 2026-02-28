import { prisma } from "../../../lib/prisma";

const getUsers = async (params: {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  size?: number;
}) => {
  const { role, status, search, page = 1, size = 20 } = params;

  const where: any = {};
  if (role && role !== "all") where.role = role;
  if (status && status !== "all") where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const skip = (page - 1) * size;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: size,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        tutorProfiles: {
          select: {
            id: true,
            title: true,
            pricePerHour: true,
            active: true,
            category: { select: { id: true, name: true } },
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, pages: Math.ceil(total / size) };
};

const getUserDetail = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      tutorProfiles: {
        select: {
          id: true,
          title: true,
          description: true,
          pricePerHour: true,
          startTime: true,
          endTime: true,
          active: true,
          category: { select: { id: true, name: true } },
          availabilities: { select: { id: true, day: true } },
        },
      },
      bookings: {
        orderBy: { date: "desc" },
        select: {
          id: true,
          date: true,
          startTime: true,
          endTime: true,
          totalPrice: true,
          status: true,
          createdAt: true,
          tutor: {
            select: {
              id: true,
              title: true,
              user: { select: { name: true, email: true } },
            },
          },
        },
      },
    },
  });

  // For tutors: add per-status booking counts and avg rating
  if (user.role === "tutor" && user.tutorProfiles) {
    const tutorProfileId = user.tutorProfiles.id;
    const [bookingStats, avgRatingResult] = await Promise.all([
      prisma.booking.groupBy({
        by: ["status"],
        where: { tutorId: tutorProfileId },
        _count: { id: true },
      }),
      prisma.review.aggregate({
        _avg: { rating: true },
        where: { booking: { tutorId: tutorProfileId } },
      }),
    ]);

    const stats = { total: 0, confirmed: 0, completed: 0, cancelled: 0 };
    for (const s of bookingStats) {
      stats.total += s._count.id;
      (stats as any)[s.status] = s._count.id;
    }

    return {
      ...user,
      tutorStats: {
        ...stats,
        avgRating: avgRatingResult._avg.rating,
      },
    };
  }

  return user;
};

const updateUserStatus = async (id: string, status: "active" | "banned") => {
  return await prisma.user.update({
    where: { id },
    data: { status },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

export const AdminServices = { getUsers, getUserDetail, updateUserStatus };
