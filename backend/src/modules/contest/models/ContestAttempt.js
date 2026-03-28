// src/modules/contest/models/ContestAttempt.js
import mongoose from "mongoose";

const contestAttemptSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        topic: {
            type: String,
            enum: ["DSA", "OOPs", "SQL"],
            required: true,
        },

        /* Immutable snapshot of questions shown to the user */
        questions: [
            {
                questionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "ContestQuestion",
                    required: true,
                },
                question: { type: String, required: true },
                options: { type: [String], required: true },
                correctIndex: { type: Number, required: true },
                difficulty: { type: String, required: true },
            },
        ],

        /* Per-question answers submitted by the user */
        answers: [
            {
                questionIndex: { type: Number, required: true, min: 0 },
                selectedIndex: { type: Number, min: -1, max: 3, default: -1 }, // -1 = skipped/timed-out
                isCorrect: { type: Boolean, default: false },
                timeTakenSecs: { type: Number, default: 30, min: 0, max: 30 },
                pointsAwarded: { type: Number, default: 0, min: 0 },
            },
        ],

        totalPoints: { type: Number, default: 0, min: 0 },
        correctCount: { type: Number, default: 0, min: 0 },
        completed: { type: Boolean, default: false, index: true },
        startedAt: { type: Date, default: Date.now },
        completedAt: { type: Date, default: null },

        /* Badges newly awarded during this attempt */
        newBadges: [{ id: String, name: String }],
    },
    { timestamps: true }
);

contestAttemptSchema.index({ user: 1, completed: 1 });
contestAttemptSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("ContestAttempt", contestAttemptSchema);
