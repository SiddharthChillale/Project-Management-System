import express, { Router } from "express";
import {
    createEvent,
    deleteEvent,
    editEvent,
    getCreateForm,
    getEditForm,
    getEvents,
    searchEvents
} from "../controllers/event.controllers.js";
import { body, param, query } from "express-validator";
import { validate } from "../validators/general.validators.js";
import {
    attachUserOrSilentFail,
    verifyTokenAndAttachUser
} from "../middlewares/auth.middlewares.js";

const router = Router();
// const s = express.Router();

router.route("/search").get(searchEvents);

router
    .route("/")
    .get(
        attachUserOrSilentFail,
        query("includeAdditional").optional().toBoolean(),
        validate,
        getEvents
    )
    .post(
        verifyTokenAndAttachUser,
        body("name").notEmpty().trim(),
        body("startDate")
            .notEmpty()
            .customSanitizer((value) => new Date(value).toISOString()),
        body("endDate")
            .notEmpty()
            .customSanitizer((value) => new Date(value).toISOString()),
        validate,
        createEvent
    );

router.route("/new").get(verifyTokenAndAttachUser, getCreateForm);
router
    .route("/:id/edit")
    .get(
        verifyTokenAndAttachUser,
        param("id").notEmpty().toInt(),
        validate,
        getEditForm
    );

router
    .route("/:id")
    .get(
        attachUserOrSilentFail,
        param("id").notEmpty().toInt(),
        validate,
        getEvents
    )
    .patch(
        verifyTokenAndAttachUser,
        param("id").notEmpty().toInt(),
        body("name").optional().trim(),
        body(["startDate", "endDate"]).optional().isDate(),
        body("projectIdArray").optional().isArray(),
        body("participantIdArray").optional().isArray(),
        validate,
        editEvent
    )
    .delete(
        verifyTokenAndAttachUser,
        param("id").notEmpty().toInt(),
        validate,
        deleteEvent
    );

export default router;
