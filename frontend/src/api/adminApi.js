// src/api/adminApi.js
import api from "../services/api.js";

/* =====================================================
   ANALYTICS
===================================================== */
export const getAnalytics = async () => {
    const res = await api.get("/admin/analytics");
    return res.data;
};

export const getAdvancedAnalytics = async () => {
    const res = await api.get("/admin/analytics/advanced");
    return res.data;
};

/* =====================================================
   USER MANAGEMENT
===================================================== */
export const getAllUsers = async ({ page = 1, limit = 10, search = "" }) => {
    const res = await api.get("/admin/users", {
        params: { page, limit, search },
    });
    return res.data;
};

export const deleteUser = async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
};

export const updateUser = async (id, updates) => {
    const res = await api.patch(`/admin/users/${id}`, updates);
    return res.data;
};

/* =====================================================
   CONTENT MANAGEMENT
===================================================== */
export const getAllContent = async ({ type, search, page = 1, limit = 10 }) => {
    const res = await api.get("/admin/content", {
        params: { type, search, page, limit },
    });
    return res.data;
};

export const createContent = async (contentData) => {
    const res = await api.post("/admin/content", contentData);
    return res.data;
};

export const updateContent = async (id, contentData) => {
    const res = await api.put(`/admin/content/${id}`, contentData);
    return res.data;
};

export const deleteContent = async (id) => {
    const res = await api.delete(`/admin/content/${id}`);
    return res.data;
};

/* =====================================================
   SETTINGS
===================================================== */
export const getSettings = async () => {
    const res = await api.get("/admin/settings");
    return res.data;
};

export const saveSettings = async (settings) => {
    const res = await api.put("/admin/settings", settings);
    return res.data;
};

/* =====================================================
   TICKETS (Admin Management)
===================================================== */
export const getAllTickets = async ({ page = 1, limit = 15, status = "" } = {}) => {
    const res = await api.get("/admin/tickets", {
        params: { page, limit, status },
    });
    return res.data;
};

export const getTicketById = async (id) => {
    const res = await api.get(`/admin/tickets/${id}`);
    return res.data;
};

export const updateTicket = async (id, data) => {
    const res = await api.patch(`/admin/tickets/${id}`, data);
    return res.data;
};

export default {
    getAnalytics,
    getAdvancedAnalytics,
    getAllUsers,
    deleteUser,
    updateUser,
    getAllContent,
    createContent,
    updateContent,
    deleteContent,
    getSettings,
    saveSettings,
    getAllTickets,
    getTicketById,
    updateTicket,
};

