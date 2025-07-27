import express, {json, urlencoded} from "express";
import helmet from "helmet";
import morgan from "morgan";
import {HealthCheckContainer} from "./domain/health_check/container";
import {UserContainer} from "./domain/user/container";
import {ArticleContainer} from "./domain/article/container";

const app = express();
const router = express.Router();

app.use(json());
app.use(urlencoded({extended: true}));
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/v1", router);

// Register router
HealthCheckContainer.setup(router);
UserContainer.setup(router);
ArticleContainer.setup(router);

export default app;
