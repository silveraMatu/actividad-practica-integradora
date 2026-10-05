import express, { Express, Request, Response, Router } from "express"
import { errorHandler } from "./common/middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

export function createApp(apiRouter: Router): Express {
  const app = express();

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
