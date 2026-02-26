import "dotenv/config";
import crypto from "crypto";
const fallbackJwtSecret = crypto.randomBytes(32).toString("hex");
export const config = {
  db_url: process.env.DATABASE_URL,
  port: process.env.PORT,
  app_url: process.env.APP_URL,
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,
  jwt_secret: process.env.JWT_SECRET || fallbackJwtSecret,
  admin_email: process.env.ADMIN_EMAIL || "admin@skillbridge.com",
  admin_password: process.env.ADMIN_PASSWORD || "admin12345",
};
