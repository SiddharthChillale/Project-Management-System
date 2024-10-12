import express, { Router } from "express";
import {
    createEvent,
    deleteEvent,
    editEvent,
    getCreateForm,
    getEditForm,
    getEvents
} from "../controllers/event.controllers.js";
import { body, param, query } from "express-validator";
import { validate } from "../validators/general.validators.js";
import {
    attachUserOrSilentFail,
    verifyTokenAndAttachUser
} from "../middlewares/auth.middlewares.js";

const router = Router();
// const s = express.Router();

router
    .route("/")
    .get(
        attachUserOrSilentFail,
        query("includeAdditional").optional().toBoolean(),
        validate,
        getEvents
    )
    .post(
        body("name").notEmpty().trim(),
        body(["startDate", "endDate"]).notEmpty().isDate(),
        validate,
        createEvent
    );

router.route("/new").get(verifyTokenAndAttachUser, getCreateForm);
router.route("/edit").get(verifyTokenAndAttachUser, getEditForm);

router
    .route("/:id")
    .get(
        attachUserOrSilentFail,
        param("id").notEmpty().toInt(),
        validate,
        getEvents
    )
    .patch(
        param("id").notEmpty().toInt(),
        body("name").optional().trim(),
        body(["startDate", "endDate"]).optional().isDate(),
        body("projectIdArray").optional().isArray(),
        body("participantIdArray").optional().isArray(),
        validate,
        editEvent
    )
    .delete(param("id").notEmpty().toInt(), validate, deleteEvent);

export default router;
