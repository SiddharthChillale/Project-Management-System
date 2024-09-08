import express from "express";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./api/v1/routes/index.routes.js";

const app = express();
// const __rootdir = path.join(import.meta.dirname, "../");

// inform express how to deal with static files
// inform express how to deal with filesystem

// middleware: set logging
if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
}

// middleware: set content-type to be json
app.use(express.json());

// middleware: handle request headers + CORS
app.use(helmet());

app.use(routes);

app.use("/", (err, req, res, next) => {
    console.log(`Error caught after all routes: ${err}`);
    res.status(500).json("Internal appServer Error\n");
});
// error handling routes

export default app;
