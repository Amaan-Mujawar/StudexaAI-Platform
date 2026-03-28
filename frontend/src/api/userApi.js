// src/api/userApi.js
import api from "../services/api.js";

/**
 * Fetch current user settings/profile
 */
export const getUserSettings = async () => {
    const res = await api.get("/user/settings");
    return res.data;
};

/**
 * Update user settings/profile
 * @param {Object} updates - { name, bio, phoneNumber, preferences }
 */
export const updateUserSettings = async (updates) => {
    const res = await api.patch("/user/settings", updates);
    return res.data;
};

export default {
    getUserSettings,
    updateUserSettings,
};
