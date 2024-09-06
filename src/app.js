import express from "express";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";

const app = express();
// const __rootdir = path.join(import.meta.dirname, "../");

import rootRouter from "./api/v1/routes/index.js";
import projectRouter from "./api/v1/routes/project.js";
import userRouter from "./api/v1/routes/user.js";

// inform express how to deal with static files
// inform express how to deal with filesystem

// inform express about logging
if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
}

// inform express about content-type to be json
app.use(express.json());

// handle db migration = done via command line

// handle request headers + CORS
app.use(helmet());

// default route to root
app.get("/", rootRouter);

// all other routes
app.use("/projects", projectRouter);

app.use("/users", userRouter);
// error handling routes

export default app;
