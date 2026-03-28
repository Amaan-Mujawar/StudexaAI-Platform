// src/modules/tickets/routes/ticket.routes.js
import express from "express";
import * as ticketController from "../controllers/ticket.controller.js";
import protect from "../../../middleware/auth.middleware.js";

const router = express.Router();

/* =====================================================
   PUBLIC — Submit a ticket (optional auth — if logged in,
   userId is captured; if not, name+email from form body)
===================================================== */
router.post("/", async (req, res, next) => {
    // Optionally attach user if JWT exists — don't block if no token
    const token =
        req.cookies?.jwt ||
        (req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : null);

    if (token) {
        // Try to authenticate, but don't fail if token is invalid
        return protect(req, res, (err) => {
            // Even if protect errors, we still proceed
            if (err) req.user = null;
            ticketController.createTicket(req, res, next);
        });
    }

    return ticketController.createTicket(req, res, next);
});

/* =====================================================
   PROTECTED USER — Get own tickets
===================================================== */
router.get("/my", protect, ticketController.getMyTickets);

export default router;
