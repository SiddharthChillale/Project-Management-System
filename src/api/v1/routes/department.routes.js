import express, { Router } from "express";
import {
    createDepartment,
    deleteDepartment,
    getDepartments,
    updateDepartment
} from "../controllers/department.controllers.js";

import {
    createCourse,
    deleteCourse,
    editCourse,
    getCourses
} from "../controllers/course.controllers.js";
import { validate } from "../validators/general.validators.js";
import { param, body } from "express-validator";
const router = Router();
// const s = express.Router();

router
    .route("/")
    .get(getDepartments)
    .post(body("name").notEmpty().trim(), validate, createDepartment);

router
    .route("/:id")
    .get(param("id").notEmpty().toInt(), validate, getDepartments)
    .patch(
        param("id").notEmpty().toInt(),
        body("name").optional().trim(),
        body("courses").isArray(),
        validate,
        updateDepartment
    )
    .delete(param("id").notEmpty().toInt(), validate, deleteDepartment);

router
    .route("/:id/courses/")
    .get(param("id").notEmpty().toInt(), validate, getCourses)
    .post(
        param("id").notEmpty().toInt(),
        body(["name", "semester", "code"]).notEmpty().trim(),
        body("year").notEmpty().toInt(),
        validate,
        createCourse
    );
router
    .route("/courses/:courseId")
    .get(param("course_id").notEmpty().toInt(), validate, getCourses);

router
    .route("/:id/courses/:courseId")
    .get(
        param("id").notEmpty().toInt(),
        param("courseId").notEmpty().toInt(),
        validate,
        getCourses
    )
    .patch(
        param("id").notEmpty().toInt(),
        param("courseId").notEmpty().toInt(),
        body(["name", "semester", "code"]).optional().trim(),
        body("year").optional().toInt(),
        validate,
        editCourse
    )
    .delete(
        param("id").notEmpty().toInt(),
        param("courseId").notEmpty().toInt(),
        validate,
        deleteCourse
    );

export default router;
