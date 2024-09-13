import express from "express";
import {
    verifyTokenAndAttachUser,
    attachUserOrSilentFail
} from "../middlewares/auth.middlewares.js";
import {
    getUsers,
    createUsers,
    loginHandler,
    logoutHandler,
    registerHandler,
    refreshAccessToken,
    editUserProfile,
    getUserProfile
} from "../controllers/user.controllers.js";

import { body, param } from "express-validator";
import { validate } from "../validators/general.validators.js";

const router = express.Router();

router.route("/all").get(verifyTokenAndAttachUser, getUsers);

router
    .route("/login")
    .post(
        body("email").isEmail().trim(),
        body("password").notEmpty(),
        validate,
        loginHandler
    );
router
    .route("/register")
    .post(
        body("email").isEmail().trim(),
        body("password").notEmpty(),
        validate,
        registerHandler
    );
router.route("/refresh-token").post(refreshAccessToken);

router.route("/create-user").post(verifyTokenAndAttachUser, createUsers);
// router.route("/bulk-create").post(verifyTokenAndAttachUser, bulkCreateUsers);
router.route("/logout").post(verifyTokenAndAttachUser, logoutHandler);

router
    .route("/:id/profile/:profile_id")
    .get(
        attachUserOrSilentFail,
        param("id").notEmpty().toInt(),
        param("profile_id").notEmpty().toInt(),
        validate,
        getUserProfile
    );

router
    .route("/profile/:profile_id")
    .patch(
        verifyTokenAndAttachUser,
        param("profile_id").notEmpty().toInt(),
        body("newProfile").exists(),
        validate,
        editUserProfile
    );

// router.delete("/:id", deleteUser);

export default router;
