import express from "express";
const router = express.Router();
import {
    getProjects,
    addProject,
    editProject,
    deleteProject
} from "../controllers/project.js";
import { checkProjectExistenceById } from "../middleware/project.js";

router.get(
    "/",
    [
        //validateToken, validateHeaders,
    ],
    getProjects
);

router.get(
    "/:id",
    [
        //validateToken, validateHeaders
    ],
    getProjects
);

router.post(
    "/",
    [
        // validateToken, validateHeaders, validateRequestFor(body)({"project": {"name"}})
    ],
    addProject
);

router.put(
    "/:id",
    [
        //validateToken, validateHeaders, validateRequestFor(body)({"project"})

        checkProjectExistenceById
    ],
    editProject
);

router.delete(
    "/:id",
    [
        //validateToken, validateHeaders, validateProjectExistence("id")
        checkProjectExistenceById
    ],
    deleteProject
);

export default router;
