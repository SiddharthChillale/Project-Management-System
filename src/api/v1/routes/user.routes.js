import express from "express";
import {
    AttachUserOrSilentFail,
    editUserProfile,
    getUserProfileAll,
    getUserProfileOne,
    loginHandler,
    logoutHandler,
    registerHandler,
    verifyTokenAndAttachUser
} from "../controllers/user.controllers.js";
import { body, param, check } from "express-validator";
import { validate } from "../validators/general.validators.js";
const router = express.Router();

router.route("/").get(getUserProfileAll);

router.route("/login").post(
    body("email").optional().isEmail().trim(),
    body("userName").optional().trim(),
    body().custom((value, { req }) => {
        if (!req.body.email && !req.body.userName) {
            throw new Error("Either email or username must be provided");
        }
        return true;
    }),
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
// router.route("/refresh-token").post();

router.route("/logout").post(verifyTokenAndAttachUser, logoutHandler);

router
    .route("/:id/profile")
    .get(
        AttachUserOrSilentFail,
        param("id").notEmpty().isAlphanumeric(),
        validate,
        getUserProfileOne
    );

router
    .route("/profile")
    .patch(
        verifyTokenAndAttachUser,
        body("newProfile").exists(),
        validate,
        editUserProfile
    );

// router.delete("/:id", deleteUser);

export default router;
