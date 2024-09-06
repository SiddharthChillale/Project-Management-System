import express from "express";
import { rootHandler } from "../controllers";
const router = express.Router();

router.get("/", rootHandler);

export default router;
