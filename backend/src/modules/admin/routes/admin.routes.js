// src/modules/admin/routes/admin.routes.js
import express from "express";
import * as adminController from "../controllers/admin.controller.js";
import * as ticketController from "../../tickets/controllers/ticket.controller.js";
import protectAdmin from "../../../middleware/adminMiddleware.js";

const router = express.Router();

/**
 * All routes in this file are protected by admin middleware
 */
router.use(protectAdmin);

// Session Check
router.get("/me", (req, res) => {
    res.status(200).json(req.user);
});

// Analytics
router.get("/analytics", adminController.getAnalytics);
router.get("/analytics/advanced", adminController.getAdvancedAnalytics);

// User Management
router.get("/users", adminController.getAllUsers);
router.delete("/users/:id", adminController.deleteUser);
router.patch("/users/:id", adminController.updateUser);

// Content Management
router.get("/content", adminController.getAllContent);
router.post("/content", adminController.createContent);
router.put("/content/:id", adminController.updateContent);
router.delete("/content/:id", adminController.deleteContent);

// Settings
router.get("/settings", adminController.getSettings);
router.put("/settings", adminController.updateSettings);

// Ticket Management (Admin)
router.get("/tickets", ticketController.getAllTickets);
router.get("/tickets/:id", ticketController.getTicketById);
router.patch("/tickets/:id", ticketController.updateTicket);

export default router;
