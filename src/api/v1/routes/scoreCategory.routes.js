import {
    createScoreCat,
    deleteScoreCat,
    getScoreCats,
    updateScoreCat
} from "../controllers/scoreCategory.controller.js";
import express, { Router } from "express";
import { validate } from "../validators/general.validators.js";
import { body, param } from "express-validator";

const router = Router();
// const s = express.Router();

router
    .route("/")
    .get(getScoreCats)
    .post(body("name").notEmpty().trim(), validate, createScoreCat);

router
    .route("/:id")
    .get(param("id").notEmpty().toInt(), validate, getScoreCats)
    .patch(
        param("id").notEmpty().toInt(),
        body("name").optional().trim(),
        validate,
        updateScoreCat
    )
    .delete(param("id").notEmpty().toInt(), validate, deleteScoreCat);

export default router;
