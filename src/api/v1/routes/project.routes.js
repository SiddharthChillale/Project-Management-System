import express from "express";
const router = express.Router();
import {
    getProjects,
    addProject,
    editProject,
    deleteProject,
    addRating,
    updateRating,
    deleteRating,
    getCreateProjectPage,
    getRating,
    getProjectLinksForm
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
            attachUserOrSilentFail,
            query("page").optional().toInt(),
            query("take").optional().toInt()
        ],
        getProjects
    )
    .post(
        [
            verifyTokenAndAttachUser,
            // body("teamSize").notEmpty().toInt(),
            // body("name").notEmpty().trim(),
            body("project")
                .isObject()
                .withMessage("request must contain project Object"),
            body("project.teamSize").notEmpty().toInt(),
            validate,
            checkForSchema(project_schema)
        ],
        addProject
    );
router.route("/new").get(verifyTokenAndAttachUser, getCreateProjectPage);
router
    .route("/:id")
    .get(
        attachUserOrSilentFail,
        param("id").notEmpty().isInt().toInt(),
        validate,
        getProjects
    )
    .put(
        [
            verifyTokenAndAttachUser,
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
            verifyTokenAndAttachUser,
            param("id").notEmpty().toInt(),
            validate,
            checkProjectExistenceById
        ],
        deleteProject
    );

router
    .route("/:id/score")
    .get(verifyTokenAndAttachUser, param("id").toInt(), getRating)
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

router
    .route("/forms/links/:index")
    .get(
        verifyTokenAndAttachUser,
        param("index").optional().toInt(),
        validate,
        getProjectLinksForm
    );
export default router;
