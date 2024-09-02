import express from "express";
import path from "path";
import morgan from "morgan";
import helmet from "helmet";

const app = express();
const __rootdir = path.join(import.meta.dirname, "../../../");


import projectRouter from "./routes/project.js";

// inform express how to deal with static files
// inform express how to deal with filesystem

// inform express about logging
app.use(morgan("dev"));

// inform express about content-type to be json
app.use(express.json())

// handle db migration
if(process.env.DB_MIGRATE == "YES"){
    console.log("DB migrated \n")
}

// handle request headers + CORS
app.use(helmet());


// default route to root
app.get("/", (req, res)=>{
    res.sendFile(path.join(__rootdir, "public", "index.html"));
});


// all other routes
app.use("/projects", projectRouter);


// error handling routes

export default app;