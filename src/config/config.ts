import "dotenv/config";
export const config = {
  db_url: process.env.DATABASE_URL,
  port: process.env.PORT,
  app_url: process.env.APP_URL,
};
