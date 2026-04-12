// src/modules/tickets/routes/ticket.routes.js
import express from "express";
import * as ticketController from "../controllers/ticket.controller.js";
import protect from "../../../middleware/auth.middleware.js";

const router = express.Router();

/* =====================================================
   GUEST — Strictly anonymous. No token/cookie read.
   Called only from the public Contact page (/contact).
   userId is ALWAYS null. No auth credentials used.
===================================================== */
router.post("/guest", ticketController.createGuestTicket);

/* =====================================================
   AUTHENTICATED USER — Requires valid JWT via protect.
   Called only from /dashboard/tickets/new.
   userId is ALWAYS req.user._id — guaranteed.
===================================================== */
router.post("/authenticated", protect, ticketController.createAuthenticatedTicket);

/* =====================================================
   AUTHENTICATED USER — Get own tickets
   GET /api/tickets/my
===================================================== */
router.get("/my", protect, ticketController.getMyTickets);

export default router;
