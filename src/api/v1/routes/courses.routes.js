// import express, { Router } from "express";

// import { body, param } from "express-validator";
// import { validate } from "../validators/general.validators.js";
// import {
//     createCourse,
//     deleteCourse,
//     editCourse,
//     getCourses
// } from "../controllers/course.controllers.js";
// const router = Router();
// // const s = express.Router();

// router
//     .route("/:id/courses/")
//     .get(param("id").notEmpty().toInt(), validate, getCourses)
//     .post(createCourse);

// router
//     .route("/:id/courses/:course_id")
//     .get(getCourses)
//     .patch(editCourse)
//     .delete(deleteCourse);

// // export default router;
