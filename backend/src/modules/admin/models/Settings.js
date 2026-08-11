// src/modules/admin/models/Settings.js
import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        value: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    { timestamps: true }
);

/**
 * Default settings used when no DB entry exists.
 * Each key corresponds to a toggle/field on the admin Settings page.
 */
settingsSchema.statics.DEFAULTS = {
    platformName: "StudexaAI",
    adminEmail: "admin@studexa.com",
    enableRegistration: true,
    maintenanceMode: false,
    enableAnalytics: true,
    enableAiFeatures: true,
    // New fields
    moderationStrictness: "medium", // low, medium, high
    contactEmail: "support@studexa.com",
    analyticsId: "UA-STUDEXA-01",
    smtpStatus: "connected",
};

/**
 * Get all settings as a flat { key: value } object
 */
settingsSchema.statics.getAll = async function () {
    const docs = await this.find({}).lean();
    const settings = { ...this.DEFAULTS };
    for (const doc of docs) {
        settings[doc.key] = doc.value;
    }
    return settings;
};

/**
 * Bulk-upsert settings from a flat object
 */
settingsSchema.statics.bulkSet = async function (updates) {
    const ops = Object.entries(updates)
        .filter(([key]) => key in this.DEFAULTS) // only allow known keys
        .map(([key, value]) => ({
            updateOne: {
                filter: { key },
                update: { $set: { key, value } },
                upsert: true,
            },
        }));

    if (ops.length > 0) {
        await this.bulkWrite(ops);
    }

    return this.getAll();
};

export default mongoose.model("Settings", settingsSchema);
