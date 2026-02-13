import express, { Request, Response } from "express";
import { ApiRoutes } from "./api/api.routes";
import cors from "cors";
import { config } from "./config/config";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

// Build allowed origins list from env
const allowedOrigins: string[] = [];
if (config.app_url) allowedOrigins.push(config.app_url);
if (config.better_url && config.better_url !== config.app_url) {
  allowedOrigins.push(config.better_url);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", ApiRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "The skill bridge is running ok" });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
