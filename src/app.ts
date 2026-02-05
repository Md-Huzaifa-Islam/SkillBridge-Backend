import express, { Request, Response } from "express";
import { ApiRoutes } from "./api/api.routes";
import cors from "cors";
import { config } from "./config/config";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", ApiRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "The skill bridge is running ok" });
});

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Export for Vercel serverless
export default app;
