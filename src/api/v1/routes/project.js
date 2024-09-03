import express from "express";
const router = express.Router();
import {
    getProjects,
    addProject,
    editProject,
    deleteProject,
} from "../controllers/project.js";

router.get("/", getProjects);

router.post("/", addProject);

router.put("/", editProject);

router.delete("/", deleteProject);

export default router;
