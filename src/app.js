import express from "express";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./api/v1/routes/index.routes.js";
import cookieParser from "cookie-parser";
import wlogger from "./logger/winston.logger.js";
import rateLimit from "express-rate-limit";

const app = express();
app.set("trust proxy", 1);
// const __rootdir = path.join(import.meta.dirname, "../");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
});

// Apply the rate limiting middleware to all requests.
if (process.env.NODE_ENV == "production") {
    app.use(limiter);
}

// inform express how to deal with static files
app.use(express.static("public"));
// inform express how to deal with filesystem
wlogger.info(`Express server started in mode - ${process.env.NODE_ENV}`);
const morganMiddleware = morgan(
    ":method :url :status :res[content-length] - :response-time ms",
    {
        stream: {
            // Configure Morgan to use our custom logger with the http severity
            write: (message) => wlogger.http(message.trim())
        }
    }
);

// middleware: set logging
if (process.env.NODE_ENV !== "test") {
    app.use(morganMiddleware);
}

app.set("view engine", "ejs");

// middleware: set content-type to be json
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
var corsOptions = {
    origin: "https://avatars.githubusercontent.com",
    optionsSuccessStatus: 200
};
// app.use(cors(corsOptions));
// middleware: handle request headers + CORS
app.use(
    helmet({
        crossOriginOpenerPolicy: false,
        contentSecurityPolicy: {
            directives: {
                "default-src": ["'self'"],
                "script-src": ["'self'", "https://unpkg.com/htmx.org@2.0.2"],
                "img-src": ["'self'", "https://avatars.githubusercontent.com"],
                upgradeInsecureRequests: []
            }
        },
        contentSecurityPolicy: false
    })
);
app.use(cookieParser());
app.use(routes);

app.use((req, res, next) => {
    const error = new Error("Error: Not found");
    error.status = 404;
    return res.status(404).json(error);
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
