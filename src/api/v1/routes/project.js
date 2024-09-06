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
        //validateHeaders, authentication, checkAuthorization
    ],
    getProjects
);

router.get(
    "/:id",
    [
        //validateHeaders, authentication,  checkAuthorization
    ],
    getProjects
);

router.post(
    "/",
    [
        //validateHeaders, authentication, checkAuthorization
        validateRequestBody(project_schema)
    ],
    addProject
);

router.put(
    "/:id",
    [
        //validateHeaders, authentication, checkAuthorization
        validateRequestBody(project_schema),
        checkProjectExistenceById
    ],
    editProject
);

router.delete(
    "/:id",
    [
        //authentication, validateHeaders, checkAuthorization
        checkProjectExistenceById
    ],
    deleteProject
);

export default router;
