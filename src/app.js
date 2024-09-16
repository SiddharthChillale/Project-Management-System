import express from "express";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./api/v1/routes/index.routes.js";
import cookieParser from "cookie-parser";

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
app.use(cookieParser());
app.use(routes);

app.use((req, res, next) => {
    const error = new Error("Error: Not found");
    error.status = 404;
    next(error);
});

// 500 error middleware ...
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
// error handling routes

export default app;
