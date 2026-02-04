import express from "express";
import { ApiRoutes } from "./api/api.routes";
import cors from "cors";
import { config } from "./config/config";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export const app = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", ApiRoutes);

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);
