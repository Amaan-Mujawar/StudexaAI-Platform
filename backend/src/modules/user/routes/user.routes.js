// src/modules/user/routes/user.routes.js
import express from "express";
import * as userController from "../controllers/user.controller.js";
import protect from '../../../middleware/auth.middleware.js';
const router = express.Router();

/**
 * All routes in this module are protected for authenticated users
 */
router.use(protect);

router.get("/settings", userController.getUserSettings);
router.patch("/settings", userController.updateUserSettings);

export default router;
