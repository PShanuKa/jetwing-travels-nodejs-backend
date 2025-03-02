import express from "express";
import { upsertMeta, getMeta } from "../controllers/metaController.js";

const router = express.Router();

router.post("/", upsertMeta);
router.get("/", getMeta);

export default router;