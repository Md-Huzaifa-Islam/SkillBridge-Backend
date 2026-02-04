import { Prisma } from "../../generated/prisma/client";
import {
  buildPaginationResponse,
  buildPrismaOrderBy,
  calculatePagination,
  parseSortOptions,
} from "../../lib/pagination";
import { prisma } from "../../lib/prisma";
import { GetTutorsQuery, SingleTutorDetails } from "../../types/tutors";

const getTutors = async (query: GetTutorsQuery) => {
  const { search, sortBy, sortOrder, category, featured, page, limit } = query;

  // Calculate pagination
  const {
    page: currentPage,
    limit: pageLimit,
    skip,
  } = calculatePagination({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  });

  // Parse sort options
  const sortOptions = parseSortOptions(
    sortBy,
    sortOrder,
    ["name", "email", "createdAt"],
    "createdAt",
    "desc",
  );

  // Build where clause
  const where: Prisma.UserWhereInput = {
    role: "teacher",
    tutorProfiles: {
      some: {},
    },
  };

  // Add search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  // Add category filter
  if (category) {
    where.tutorProfiles = {
      some: {
        category_id: category,
      },
    };
  }

  // Add featured filter - if featured is explicitly provided
  if (featured !== undefined) {
    const isFeatured = featured === "true";
    where.tutorProfiles = {
      some: {
        ...((where.tutorProfiles as any)?.some || {}),
        featured: isFeatured,
      },
    };
  }

  // Build orderBy with featured priority if not explicitly filtered
  let orderBy: any[] = [];

  if (featured === undefined) {
    orderBy.push({
      tutorProfiles: {
        _count: "desc",
      },
    });
  }

  // Add the main sort field
  if (sortOptions.sortBy === "name" || sortOptions.sortBy === "email") {
    orderBy.push({
      [sortOptions.sortBy]: sortOptions.sortOrder,
    });
  } else {
    orderBy.push(buildPrismaOrderBy(sortOptions.sortBy, sortOptions.sortOrder));
  }

  // Get total count
  const total = await prisma.user.count({ where });

  // Fetch tutors with their profiles
  const tutors = await prisma.user.findMany({
    where,
    skip,
    take: pageLimit,
    orderBy,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      tutorProfiles: {
        orderBy: featured === undefined ? { featured: "desc" } : undefined,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  // If featured is not specified, sort tutors by whether they have featured profiles
  let sortedTutors = tutors;
  if (featured === undefined) {
    sortedTutors = tutors.sort((a, b) => {
      const aHasFeatured = a.tutorProfiles.some((p) => p.featured);
      const bHasFeatured = b.tutorProfiles.some((p) => p.featured);
      if (aHasFeatured && !bHasFeatured) return -1;
      if (!aHasFeatured && bHasFeatured) return 1;
      return 0;
    });
  }

  return buildPaginationResponse(sortedTutors, total, currentPage, pageLimit);
};

const getATutor = async (
  tutorId: string,
): Promise<SingleTutorDetails | null> => {
  const tutor = await prisma.user.findUnique({
    where: {
      id: tutorId,
      role: "teacher",
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      tutorProfiles: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          featured: "desc",
        },
      },
    },
  });

  if (!tutor || tutor.tutorProfiles.length === 0) {
    return null;
  }

  // Set the first profile (highest featured) as main profile
  const [mainProfile, ...otherProfiles] = tutor.tutorProfiles;

  return {
    id: tutor.id,
    name: tutor.name,
    email: tutor.email,
    image: tutor.image,
    createdAt: tutor.createdAt,
    mainProfile: mainProfile || null,
    otherProfiles: otherProfiles || [],
  };
};

export const TutorsServices = {
  getTutors,
  getATutor,
};
