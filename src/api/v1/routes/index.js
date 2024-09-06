import express from "express";
import { rootHandler } from "../controllers/index.js";
const router = express.Router();

router.get("/", rootHandler);

export default router;
