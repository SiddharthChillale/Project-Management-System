import express from "express";
import { rootHandler } from "../controllers/index.controllers.js";

import projectRouter from "./project.routes.js";
import userRouter from "./user.routes.js";
import eventRouter from "./event.routes.js";
import departmentRouter from "./department.routes.js";
import scoreCatRouter from "./scoreCategory.routes.js";

const router = express.Router();

router.get("/", rootHandler);

// all other routes
router.use("/api/v1/projects", projectRouter);
router.use("/api/v1/users", userRouter);
router.use("/api/v1/events", eventRouter);
router.use("/api/v1/score-category", scoreCatRouter);
router.use("/api/v1/departments", departmentRouter);
// routes for ratings
// routes for project-associations

export default router;
