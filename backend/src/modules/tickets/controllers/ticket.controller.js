// src/modules/tickets/controllers/ticket.controller.js
import asyncHandler from "../../../utils/asyncHandler.js";
import * as ticketService from "../services/ticket.service.js";

/* =====================================================
   GUEST — Submit ticket from public Contact page
   POST /api/tickets/guest
   - No authentication read of any kind
   - userId is explicitly null — always
   - Name + email come from the form body
===================================================== */
export const createGuestTicket = asyncHandler(async (req, res) => {
    const ticket = await ticketService.createTicketService(
        {
            ...req.body,
            userAgent: req.headers["user-agent"] || "",
        },
        null // ← explicitly null: this route never touches req.user
    );

    res.status(201).json({
        message: "Ticket submitted successfully. We'll get back to you soon!",
        ticket: {
            _id: ticket._id,
            ticketNumber: ticket.ticketNumber,
            subject: ticket.subject,
            status: ticket.status,
            createdAt: ticket.createdAt,
        },
    });
});

/* =====================================================
   AUTHENTICATED USER — Submit ticket from dashboard
   POST /api/tickets/authenticated
   - protect middleware guarantees req.user is present
   - userId is ALWAYS req.user._id — no guessing
   - Name + email are taken from the body (pre-filled
     from auth context on the frontend, but validated here)
===================================================== */
export const createAuthenticatedTicket = asyncHandler(async (req, res) => {
    const ticket = await ticketService.createTicketService(
        {
            ...req.body,
            userAgent: req.headers["user-agent"] || "",
        },
        req.user._id // ← guaranteed by protect middleware
    );

    res.status(201).json({
        message: "Ticket submitted successfully. We'll get back to you soon!",
        ticket: {
            _id: ticket._id,
            ticketNumber: ticket.ticketNumber,
            subject: ticket.subject,
            status: ticket.status,
            createdAt: ticket.createdAt,
        },
    });
});

/* =====================================================
   AUTHENTICATED USER — Get own tickets
   GET /api/tickets/my
===================================================== */
export const getMyTickets = asyncHandler(async (req, res) => {
    const tickets = await ticketService.getUserTicketsService({
        userId: req.user._id,
        email: req.user.email,   // used to claim guest tickets by email match
    });
    res.status(200).json({ tickets });
});

/* =====================================================
   ADMIN — Get all tickets
   GET /api/admin/tickets
===================================================== */
export const getAllTickets = asyncHandler(async (req, res) => {
    const { page, limit, status } = req.query;
    const result = await ticketService.getAllTicketsService({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 15,
        status: status || "",
    });
    res.status(200).json(result);
});

/* =====================================================
   ADMIN — Get single ticket
   GET /api/admin/tickets/:id
===================================================== */
export const getTicketById = asyncHandler(async (req, res) => {
    const ticket = await ticketService.getTicketByIdService(req.params.id);
    res.status(200).json(ticket);
});

/* =====================================================
   ADMIN — Update ticket status + resolution note
   PATCH /api/admin/tickets/:id
===================================================== */
export const updateTicket = asyncHandler(async (req, res) => {
    const adminEmail = req.user?.email || "admin";
    const updates = { ...req.body };
    if (updates.assignedTo === "me" || updates.assignedTo === true) {
        updates.assignedTo = adminEmail;
    }
    const ticket = await ticketService.updateTicketService(
        req.params.id,
        updates,
        adminEmail
    );
    res.status(200).json({
        message: "Ticket updated successfully",
        ticket,
    });
});
