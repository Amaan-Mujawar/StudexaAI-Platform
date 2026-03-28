// src/modules/tickets/services/ticket.service.js
import Ticket from "../models/Ticket.js";
import { sendTicketResolvedEmail } from "../../../services/emailService.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/* =====================================================
   CREATE TICKET (public — optional auth)
===================================================== */
export const createTicketService = async (data, userId = null) => {
    const { subject, name, email, message, userAgent } = data;

    if (!name?.trim() || !message?.trim()) {
        const err = new Error("Name and message are required");
        err.statusCode = 400;
        throw err;
    }

    if (!email?.trim()) {
        const err = new Error("Email is required to track your ticket");
        err.statusCode = 400;
        throw err;
    }

    const ticket = await Ticket.create({
        subject: subject || "support",
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        userId: userId || null,
        userAgent: userAgent || "",
        status: "open",
    });

    console.log(`[Ticket] Created ${ticket.ticketNumber} for ${ticket.email}`);
    return ticket;
};

/* =====================================================
   GET ALL TICKETS — Admin (paginated + filterable)
===================================================== */
export const getAllTicketsService = async ({ page = 1, limit = 15, status = "" }) => {
    const query = {};
    if (status && ["open", "in_progress", "resolved"].includes(status)) {
        query.status = status;
    }

    const total = await Ticket.countDocuments(query);
    const tickets = await Ticket.find(query)
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return {
        tickets,
        pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
        },
        counts: {
            open: await Ticket.countDocuments({ status: "open" }),
            in_progress: await Ticket.countDocuments({ status: "in_progress" }),
            resolved: await Ticket.countDocuments({ status: "resolved" }),
        },
    };
};

/* =====================================================
   GET SINGLE TICKET — Admin
===================================================== */
export const getTicketByIdService = async (id) => {
    if (!isValidObjectId(id)) {
        const err = new Error("Invalid ticket ID");
        err.statusCode = 400;
        throw err;
    }

    const ticket = await Ticket.findById(id).populate("userId", "name email");
    if (!ticket) {
        const err = new Error("Ticket not found");
        err.statusCode = 404;
        throw err;
    }

    return ticket;
};

/* =====================================================
   UPDATE TICKET STATUS — Admin
   Triggers email when status changes to 'resolved'
===================================================== */
export const updateTicketService = async (id, updates, adminEmail) => {
    if (!isValidObjectId(id)) {
        const err = new Error("Invalid ticket ID");
        err.statusCode = 400;
        throw err;
    }

    const { status, resolutionNote, assignedTo } = updates;
    const allowedStatuses = ["open", "in_progress", "resolved"];

    if (status && !allowedStatuses.includes(status)) {
        const err = new Error("Invalid status value");
        err.statusCode = 400;
        throw err;
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
        const err = new Error("Ticket not found");
        err.statusCode = 404;
        throw err;
    }

    const wasResolved = ticket.status === "resolved";
    const isBeingResolved = status === "resolved" && !wasResolved;

    // Apply updates
    if (status) ticket.status = status;
    if (resolutionNote !== undefined) ticket.resolutionNote = resolutionNote;
    if (assignedTo !== undefined) ticket.assignedTo = assignedTo === "" ? null : assignedTo;

    if (isBeingResolved) {
        ticket.resolvedAt = new Date();
        ticket.resolvedBy = adminEmail || "admin";
    }

    await ticket.save();

    // Send email if just resolved (and hasn't already had notification sent)
    if (isBeingResolved && !ticket.notificationSent) {
        const emailResult = await sendTicketResolvedEmail(ticket);
        if (emailResult.sent) {
            ticket.notificationSent = true;
            await ticket.save();
        }
    }

    console.log(`[Ticket] Updated ${ticket.ticketNumber}: status=${ticket.status}`);
    return ticket;
};

/* =====================================================
   GET USER'S OWN TICKETS — Authenticated User
===================================================== */
export const getUserTicketsService = async (userId) => {
    if (!isValidObjectId(userId)) {
        const err = new Error("Invalid user ID");
        err.statusCode = 400;
        throw err;
    }

    const tickets = await Ticket.find({ userId })
        .sort({ createdAt: -1 })
        .select("-userAgent -notificationSent -resolvedBy");

    return tickets;
};
