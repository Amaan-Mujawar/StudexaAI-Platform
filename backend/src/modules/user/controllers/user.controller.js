// src/modules/user/controllers/user.controller.js
import asyncHandler from "../../../utils/asyncHandler.js";
import User from "../../auth/models/User.js";

/**
 * GET /api/user/settings
 * Fetch current user profile and preferences
 */
export const getUserSettings = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("+password"); // password not needed for settings view usually, but select it if we need to check later
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Sanitize: don't send back password even if selected for internal use
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json(userObj);
});

/**
 * PATCH /api/user/settings
 * Update profile and preferences
 */
export const updateUserSettings = asyncHandler(async (req, res) => {
    const { name, phoneNumber, bio, preferences } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (name) user.name = name;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.bio = bio;

    if (preferences) {
        // Deep merge or specific field override
        if (preferences.notifications) {
            user.preferences.notifications = {
                ...user.preferences.notifications,
                ...preferences.notifications
            };
        }
        if (preferences.privacy) {
            user.preferences.privacy = {
                ...user.preferences.privacy,
                ...preferences.privacy
            };
        }
        if (preferences.theme) {
            user.preferences.theme = preferences.theme;
        }
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json(updatedUser);
});
