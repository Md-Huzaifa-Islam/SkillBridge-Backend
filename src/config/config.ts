import "dotenv/config";

export const config = {
  port: process.env.PORT || 3000,
  node_env: process.env.NODE_ENV || "development",
  better_url: process.env.BETTER_AUTH_URL,
  app_url: process.env.app_url,
  smtp_host: process.env.SMTP_HOST,
  smtp_port: Number(process.env.SMTP_PORT),
  smtp_secure: process.env.SMTP_SECURE === "true",
  smtp_user: process.env.SMTP_USER,
  smtp_pass: process.env.SMTP_PASS,
  smtp_from: process.env.SMTP_FROM,
};
