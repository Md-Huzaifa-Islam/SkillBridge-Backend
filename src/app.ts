import express from "express";
import { ApiRoutes } from "./api/api.routes";
import cors from "cors";
import { config } from "./config/config";

export const app = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use("/api", ApiRoutes);

app.use(express.json());
