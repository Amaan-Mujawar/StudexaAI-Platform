// src/modules/admin/models/Content.js
import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters"],
        },
        type: {
            type: String,
            required: [true, "Content type is required"],
            enum: ["study-material", "test", "quiz"],
        },
        description: {
            type: String,
            trim: true,
        },
        // For study materials, this could be markdown or a rich text string
        // For tests/quizzes, this might be structured JSON
        body: {
            type: mongoose.Schema.Types.Mixed,
            required: [true, "Content body is required"],
        },
        // Optional file URL for PDFs/Images
        fileUrl: {
            type: String,
            default: null,
        },
        // Meta data for tests/quizzes
        topic: {
            type: String,
            trim: true,
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "medium",
        },
        // Tracking usage for analytics
        accessCount: {
            type: Number,
            default: 0,
        },
        createdBy: {
            type: String,
            default: "admin",
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "published",
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// Search indexes
contentSchema.index({ title: "text", topic: "text" });

// Exclude soft-deleted content from all find queries by default
contentSchema.pre(/^find/, function () {
    if (!this.getQuery().includeSoftDeleted) {
        this.where({ deletedAt: null });
    } else {
        delete this.getQuery().includeSoftDeleted;
    }
});

export default mongoose.model("Content", contentSchema);
