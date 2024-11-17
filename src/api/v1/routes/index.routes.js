import express from "express";
import { healthCheck, rootHandler } from "../controllers/index.controllers.js";

import projectRouter from "./project.routes.js";
import userRouter from "./user.routes.js";
import eventRouter from "./event.routes.js";
import departmentRouter from "./department.routes.js";
import scoreCatRouter from "./scoreCategory.routes.js";
import { attachUserOrSilentFail } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get("/", attachUserOrSilentFail, rootHandler);
router.get("/api/v1/", attachUserOrSilentFail, rootHandler);
router.get("/api/v1/health", healthCheck);
// all other routes
router.use("/api/v1/projects", projectRouter);
router.use("/api/v1/users", userRouter);
router.use("/api/v1/events", eventRouter);
router.use("/api/v1/score-category", scoreCatRouter);
router.use("/api/v1/departments", departmentRouter);

// routes for ratings
// routes for project-associations

export default router;
