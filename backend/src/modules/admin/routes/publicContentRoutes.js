// src/modules/admin/routes/publicContent.routes.js
import express from "express";
import * as adminController from "../controllers/admin.controller.js";

const router = express.Router();

/**
 * Public/Student access to content uploaded by Admin
 */
router.get("/", adminController.getAllContent);

export default router;
