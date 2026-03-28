// src/modules/tickets/controllers/ticket.controller.js
import asyncHandler from "../../../utils/asyncHandler.js";
import * as ticketService from "../services/ticket.service.js";

/* =====================================================
   PUBLIC — Submit a new ticket
   POST /api/tickets
===================================================== */
export const createTicket = asyncHandler(async (req, res) => {
    // Attach userId if the user is authenticated (optional)
    const userId = req.user?._id || null;

    const ticket = await ticketService.createTicketService(
        {
            ...req.body,
            userAgent: req.headers["user-agent"] || "",
        },
        userId
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
   PROTECTED USER — Get own tickets
   GET /api/tickets/my
===================================================== */
export const getMyTickets = asyncHandler(async (req, res) => {
    const tickets = await ticketService.getUserTicketsService(req.user._id);
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
