import express from "express";
import {
    addUser,
    deleteUser,
    editUser,
    getUsers
} from "../controllers/user.js";
const router = express.Router();

router.get("/", getUsers); //get all users
router.get("/:id", getUsers); // get user by id

router.post("/", addUser); // add multiple users or a single user. what about password?

router.put("/:id", editUser);
router.delete("/:id", deleteUser);
// router.post("/signup", signUpHandler); // add user with password.
// router.post("/login", loginHandler);

export default router;
