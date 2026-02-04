export interface GetTutorsQuery {
  search?: string;
  sortBy?: "name" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
  category?: string;
  featured?: "true" | "false";
  page?: string;
  limit?: string;
}

export interface TutorWithDetails {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: Date;
  tutorProfiles: {
    id: string;
    description: string | null;
    price_per_hour: number;
    featured: boolean;
    category: {
      id: string;
      name: string;
    };
  }[];
}

export interface SingleTutorDetails {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: Date;
  mainProfile: {
    id: string;
    description: string | null;
    price_per_hour: number;
    featured: boolean;
    category: {
      id: string;
      name: string;
    };
  } | null;
  otherProfiles: {
    id: string;
    description: string | null;
    price_per_hour: number;
    featured: boolean;
    category: {
      id: string;
      name: string;
    };
  }[];
}
