import cors from "cors";
import express, { Request, Response } from "express";
import { config } from "./config/config";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
const app = express();

//middlewares

// --> cors
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

// root route
app.get("/", async (req: Request, res: Response) => {
  res.send("This is the backend of skill bridge");
});

// not found route handler
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

export default app;
