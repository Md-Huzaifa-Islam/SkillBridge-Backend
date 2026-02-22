import cors from "cors";
import express, { Application, Request, Response } from "express";
import { config } from "./config/config";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
const app: Application = express();

//middlewares

// --> cors
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

// json perser
app.use(express.json());

// root route
app.get("/", async (req: Request, res: Response) => {
  res.send("This is the backend of skill bridge");
});

// not found route handler
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

export default app;
