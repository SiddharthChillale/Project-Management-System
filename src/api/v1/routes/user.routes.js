import express from "express";
import {
    AttachUserOrSilentFail,
    editUserProfile,
    getUserProfileAll,
    getUserProfileOne,
    loginHandler,
    logoutHandler,
    refreshAccessToken,
    registerHandler,
    verifyTokenAndAttachUser
} from "../controllers/user.controllers.js";
import { body, param, check } from "express-validator";
import { validate } from "../validators/general.validators.js";
const router = express.Router();

router.route("/").get(getUserProfileAll);

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

router.route("/logout").post(verifyTokenAndAttachUser, logoutHandler);

router
    .route("/:id/profile/:profile_id")
    .get(
        AttachUserOrSilentFail,
        param("id").notEmpty().toInt(),
        param("profile_id").notEmpty().toInt(),
        validate,
        getUserProfileOne
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
