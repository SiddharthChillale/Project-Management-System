import express from "express";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./api/v1/routes/index.routes.js";

const app = express();
// const __rootdir = path.join(import.meta.dirname, "../");

// inform express how to deal with static files
// inform express how to deal with filesystem

// inform express about logging
if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
}

// inform express about content-type to be json
app.use(express.json());

// handle db migration = done via command line
app.use(routes);
// handle request headers + CORS
app.use(helmet());

// error handling routes

export default app;
