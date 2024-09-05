import express from "express";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";

const app = express();
// const __rootdir = path.join(import.meta.dirname, "../");

import projectRouter from "./api/v1/routes/project.js";

// inform express how to deal with static files
// inform express how to deal with filesystem

// inform express about logging
if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
}

// inform express about content-type to be json
app.use(express.json());

// handle db migration
if (process.env.DB_MIGRATE == "YES") {
    console.log("DB migrated \n");
}

// handle request headers + CORS
app.use(helmet());

// default route to root
// TODO: Put it in its own controller
app.get("/", (req, res) => {
    // res.sendFile(path.join(__rootdir, "public", "index.html"));
    res.send({}).status(200);
});

// all other routes
app.use("/projects", projectRouter);

// error handling routes

export default app;
