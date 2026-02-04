export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface SortOptions {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Calculate pagination parameters for database queries
 * @param options - Pagination options with page and limit
 * @returns Object with page, limit, and skip values
 */
export const calculatePagination = (options: PaginationOptions) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

/**
 * Build pagination response
 */
export const buildPaginationResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginationResult<T> => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Parse sort parameters and validate against allowed fields
 */
export const parseSortOptions = (
  sortBy?: string,
  sortOrder?: string,
  allowedFields: string[] = [],
  defaultSortBy: string = "createdAt",
  defaultSortOrder: "asc" | "desc" = "desc",
): { sortBy: string; sortOrder: "asc" | "desc" } => {
  // Validate sort field
  const validatedSortBy =
    sortBy && allowedFields.includes(sortBy) ? sortBy : defaultSortBy;

  // Validate sort order
  const validatedSortOrder =
    sortOrder === "asc" || sortOrder === "desc" ? sortOrder : defaultSortOrder;

  return {
    sortBy: validatedSortBy,
    sortOrder: validatedSortOrder,
  };
};

/**
 * Build Prisma orderBy object
 */
export const buildPrismaOrderBy = (
  sortBy: string,
  sortOrder: "asc" | "desc",
): any => {
  // Handle nested sorting (e.g., "user.name")
  if (sortBy.includes(".")) {
    const [relation, field] = sortBy.split(".");
    return {
      [relation]: {
        [field]: sortOrder,
      },
    };
  }

  return {
    [sortBy]: sortOrder,
  };
};
