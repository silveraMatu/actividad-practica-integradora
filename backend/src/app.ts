import "dotenv/config"
import express , {Request, Response} from "express"
import { router } from "./modules/routes.js";
import { errorHandler } from "./common/middlewares/errorHandler.js";

export const app = express();

app.use(express.json())
app.use("/api", router)

app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "ok",
  });
});

app.use(errorHandler)
