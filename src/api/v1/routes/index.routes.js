import express from "express";
import { rootHandler } from "../controllers/index.controllers.js";

import projectRouter from "./project.routes.js";
import userRouter from "./user.routes.js";

const router = express.Router();

router.get("/", rootHandler);

// all other routes
router.use("/projects", projectRouter);
router.use("/users", userRouter);

export default router;