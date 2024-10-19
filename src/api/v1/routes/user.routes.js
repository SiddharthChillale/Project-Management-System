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
    getUserProfile,
    assignmentHandler,
    detachHandler,
    getAvailableProfiles,
    chooseProfile,
    loginViewHandler,
    registerViewHandler,
    dashboardViewHandler,
    getCreateUserPage,
    getCreateUsersFormAdditional
} from "../controllers/user.controllers.js";

import { body, param } from "express-validator";
import validateUsers, { validate } from "../validators/general.validators.js";

const router = express.Router();

//only accessible to all profiles with role=ADMIN or PM, hence require the verifyTokenAndAttachUser
router.route("/").get(verifyTokenAndAttachUser, getUsers);

router
    .route("/login")
    .get(loginViewHandler)
    .post(
        body("email").isEmail().trim(),
        body("password").notEmpty(),
        validate,
        loginHandler
    );
router
    .route("/register")
    .get(registerViewHandler)
    .post(
        body("email").isEmail().trim(),
        body("password").notEmpty(),
        validate,
        registerHandler
    );

router.route("/dashboard").get(verifyTokenAndAttachUser, dashboardViewHandler);
router.route("/refresh-token").post(refreshAccessToken);

router
    .route("/create-users")
    .post(
        verifyTokenAndAttachUser,
        body("users").isArray().notEmpty(),
        validateUsers,
        body("bulkUpload").optional(),
        validate,
        createUsers
    );

router
    .route("/create-users/form/add/:index")
    .get(
        verifyTokenAndAttachUser,
        param("index").toInt(),
        validate,
        getCreateUsersFormAdditional
    );
// router.route("/bulk-create").post(verifyTokenAndAttachUser, bulkCreateUsers);
router.route("/logout").post(verifyTokenAndAttachUser, logoutHandler);

router
    .route("/profile/choose")
    .get(verifyTokenAndAttachUser, getAvailableProfiles)
    .post(
        verifyTokenAndAttachUser,
        body("profile_id").notEmpty().toInt(),
        chooseProfile
    );

// router
//     .route("/profile/choose/:profileId")
//     .get(verifyTokenAndAttachUser, param("profileId").toInt(), chooseProfile);

router.route("/new").get(verifyTokenAndAttachUser, getCreateUserPage);

router
    .route("/profile/:profile_id")
    .get(
        verifyTokenAndAttachUser,
        param("profile_id").optional().toInt(),
        validate,
        getUserProfile
    )
    .patch(
        verifyTokenAndAttachUser,
        param("profile_id").notEmpty().toInt(),
        body("newProfile").exists(),
        validate,
        editUserProfile
    );

router.route("/profile/:profile_id/detach-project").post(
    verifyTokenAndAttachUser,
    param("profile_id").toInt(),
    body("project_id").notEmpty(),
    validate,
    detachHandler // delete an entry from either ratings table or associations table. | can be used by devs to unenroll | can be used by ADMIN or PM to detach a user from a project
);

router.route("/profile/:profile_id/assign").post(
    verifyTokenAndAttachUser,
    param("profile_id").toInt(),
    body("project").notEmpty(),
    validate,
    assignmentHandler // must be same in project.routes | can be used by ADMIN or PM to assign users to project
);
// router.delete("/:id", deleteUser);

export default router;
