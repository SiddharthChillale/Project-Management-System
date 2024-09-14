import express, { Router } from "express";
import {
    createEvent,
    deleteEvent,
    editEvent,
    getEvents
} from "../controllers/event.controllers.js";
import { body } from "express-validator";
import { validate } from "../validators/general.validators.js";

const router = Router();
// const s = express.Router();

router
    .route("/")
    .get(getEvents)
    .post(
        body("name").notEmpty().trim(),
        body(["startDate", "endDate"]).notEmpty().isDate(),
        validate,
        createEvent
    );

router
    .route("/:id")
    .get(param("id").notEmpty().toInt(), validate, getEvents)
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
