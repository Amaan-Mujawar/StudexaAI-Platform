// src/modules/tickets/models/Ticket.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    /* --- Identity --- */
    ticketNumber: {
      type: String,
      unique: true,
      index: true,
    },

    /* --- Submission Data --- */
    subject: {
      type: String,
      enum: ["suggestion", "bug", "support", "privacy"],
      required: [true, "Subject is required"],
      default: "support",
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [5000, "Message must not exceed 5000 characters"],
    },

    /* --- User Reference (optional, populated when logged in) --- */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /* --- Status & Workflow --- */
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved"],
      default: "open",
    },

    /* --- Admin Response --- */
    resolutionNote: {
      type: String,
      trim: true,
      default: "",
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolvedBy: {
      type: String, // admin email
      default: null,
    },
    assignedTo: {
      type: String, // admin email who is handling this ticket
      default: null,
    },

    /* --- Metadata --- */
    userAgent: {
      type: String,
      default: "",
    },

    /* --- Email notification tracking --- */
    notificationSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* Auto-generate safe, unique ticket number before saving */
ticketSchema.pre("save", function () {
  if (!this.ticketNumber) {
    const timestamp = Date.now().toString(36).toUpperCase(); // time-based
    const random = Math.random().toString(36).substring(2, 8).toUpperCase(); // randomness
    this.ticketNumber = `TKT-${timestamp}-${random}`;
  }
});

/* Indexes for efficient queries */
ticketSchema.index({ status: 1, createdAt: -1 });
ticketSchema.index({ userId: 1, createdAt: -1 });
ticketSchema.index({ email: 1 });

export default mongoose.model("Ticket", ticketSchema);