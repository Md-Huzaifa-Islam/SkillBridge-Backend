import express from "express";
import { ApiRoutes } from "./api/api.routes";

export const app = express();

app.use("/api", ApiRoutes);

app.use(express.json());
