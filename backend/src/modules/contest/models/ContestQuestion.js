// src/modules/contest/models/ContestQuestion.js
import mongoose from "mongoose";

const contestQuestionSchema = new mongoose.Schema(
    {
        topic: {
            type: String,
            enum: ["DSA", "OOPs", "SQL"],
            required: true,
            index: true,
        },

        question: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
        },

        options: {
            type: [String],
            required: true,
            validate: {
                validator: (v) => Array.isArray(v) && v.length === 4,
                message: "Exactly 4 options required",
            },
        },

        correctIndex: {
            type: Number,
            required: true,
            min: 0,
            max: 3,
        },

        explanation: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true,
            index: true,
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    { timestamps: true }
);

/* Fast leaderboard query index */
contestQuestionSchema.index({ topic: 1, difficulty: 1, isActive: 1 });

export default mongoose.model("ContestQuestion", contestQuestionSchema);
