import "dotenv/config";
export const config = {
  db_url: process.env.DATABASE_URL,
  port: process.env.PORT,
  app_url: process.env.APP_URL,
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,
};
