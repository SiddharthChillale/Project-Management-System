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
import { body, param } from "express-validator";
import { validate } from "../validators/general.validators.js";
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
            body("project").isObject().withMessage("Must be Project Object"),
            validate,
            checkForSchema(project_schema)
        ],
        addProject
    );

router
    .route("/:id")
    .get(
        [
            //validateHeaders, authentication,  checkAuthorization
            param("id").notEmpty().toInt(),
            validate
        ],
        getProjects
    )
    .put(
        [
            //validateHeaders, authentication, checkAuthorization
            param("id").notEmpty().toInt(),
            body("project").isObject(),
            validate,
            checkForSchema(project_schema),
            checkProjectExistenceById
        ],
        editProject
    )
    .delete(
        [
            //authentication, validateHeaders, checkAuthorization
            param("id").notEmpty().toInt(),
            validate,
            checkProjectExistenceById
        ],
        deleteProject
    );

export default router;
