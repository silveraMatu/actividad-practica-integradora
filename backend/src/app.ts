import express, { Express, Request, Response, Router } from "express"
import { errorHandler } from "./common/middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";

export function createApp(apiRouter: Router): Express {
  const app = express();

  app.use(cors({ origin: "http://localhost:5173", credentials: true }))
  app.use(cookieParser())
  app.use(express.json())
  app.use("/api", apiRouter)

  app.get("/", (req: Request, res: Response) => {
    res.json({
      status: "ok",
    });
  });

  app.use(errorHandler)

  return app;
}
