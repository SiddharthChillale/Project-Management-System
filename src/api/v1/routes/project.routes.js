import express from "express";
const router = express.Router();
import {
    getProjects,
    addProject,
    editProject,
    deleteProject
} from "../controllers/project.controllers.js";
import { checkProjectExistenceById } from "../middlewares/projectValidation.middlewares.js";
import checkForSchema from "../middlewares/schemaValidation.middlewares.js";
import project_schema from "../ajv_schemas/project.schema.js";

router
    .route("/")
    .get(
        [
            //validateHeaders, authentication, checkAuthorization
        ],
        getProjects
    )
    .post(
        [
            //validateHeaders, authentication, checkAuthorization
            checkForSchema(project_schema)
        ],
        addProject
    );

router
    .route("/:id")
    .get(
        [
            //validateHeaders, authentication,  checkAuthorization
        ],
        getProjects
    )
    .put(
        [
            //validateHeaders, authentication, checkAuthorization
            checkForSchema(project_schema),
            checkProjectExistenceById
        ],
        editProject
    )
    .delete(
        [
            //authentication, validateHeaders, checkAuthorization
            checkProjectExistenceById
        ],
        deleteProject
    );

export default router;
