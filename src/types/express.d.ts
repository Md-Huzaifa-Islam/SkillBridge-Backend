import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        name: string;
        id: string;
        email: string;
        emailVerified: boolean;
        image?: string | null;
        createdAt: Date;
        updatedAt: Date;
        role?: string | null;
        status?: string | null;
      };
    }
  }
}
