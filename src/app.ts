import { config } from "./config/config";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import express, { Application, Request, Response } from "express";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { ApiRoutes } from "./api";
const app: Application = express();

//middlewares

// --> security headers
app.use(helmet());

// --> rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// --> cors
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// --> json parser
app.use(express.json());

// root route
app.get("/", async (req: Request, res: Response) => {
  res.send("This is the backend of skill bridge");
});

// api route
app.use("/api", ApiRoutes);

// not found route handler
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

export default app;
