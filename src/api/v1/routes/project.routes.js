import express from "express";
const router = express.Router();
import {
    getProjects,
    addProject,
    editProject,
    deleteProject,
    addRating,
    updateRating,
    deleteRating
} from "../controllers/project.controllers.js";
import { checkProjectExistenceById } from "../middlewares/projectValidation.middlewares.js";
import checkForSchema from "../middlewares/schemaValidation.middlewares.js";
import project_schema from "../ajv_schemas/project.schema.js";
import { body, param, query } from "express-validator";
import { validate } from "../validators/general.validators.js";
import {
    attachUserOrSilentFail,
    verifyTokenAndAttachUser
} from "../middlewares/auth.middlewares.js";
import { assignmentHandler } from "../controllers/user.controllers.js";
router
    .route("/")
    .get(
        [
            //validateHeaders, authentication, checkAuthorization
            query("page").optional().toInt(),
            query("take").optional().toInt()
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

router
    .route("/:id/rate")
    .post(
        verifyTokenAndAttachUser,
        param("id").toInt(),
        body("score").notEmpty().toInt(),
        validate,
        addRating
    )
    .patch(
        verifyTokenAndAttachUser,
        param("id").toInt(),
        body("score").notEmpty().toInt(),
        validate,
        updateRating
    )
    .delete(
        verifyTokenAndAttachUser,
        param("id").toInt(),
        body("score").notEmpty().toInt(),
        validate,
        deleteRating
    );
// .get(
//     attachUserOrSilentFail,
//     param("id").toInt(),
//     body("score").notEmpty().toInt(),
//     validate,
//     getRating
// )

router
    .route("/:id/assign")
    .post(
        param("id").toInt(),
        body("profiles").isArray(),
        body("role").notEmpty(),
        validate,
        assignmentHandler
    ); // creates an entry in ratings if role is reviewer, or an entry in associations if role is anything else.

export default router;
