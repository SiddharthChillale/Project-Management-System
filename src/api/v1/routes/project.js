import express from "express";
const router = express.Router();
import {
    getProjects,
    addProject,
    editProject,
    deleteProject
} from "../controllers/project.js";
import { checkProjectExistenceById } from "../middleware/project.js";
import validateRequestBody from "../middleware/validation.js";
import project_schema from "../middleware/project_schema.js";

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
        validateRequestBody(project_schema)
    ],
    addProject
);

router.put(
    "/:id",
    [
        //validateToken, validateHeaders, validateRequestFor(body)({"project"})
        validateRequestBody(project_schema),
        checkProjectExistenceById
    ],
    editProject
);

router.delete(
    "/:id",
    [
        //validateToken, validateHeaders,
        checkProjectExistenceById
    ],
    deleteProject
);

export default router;
