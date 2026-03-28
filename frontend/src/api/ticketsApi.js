// src/api/ticketsApi.js
import api from "../services/api.js";

/* =====================================================
   PUBLIC — Submit a support ticket
===================================================== */
export const submitTicket = async (data) => {
    const res = await api.post("/tickets", data);
    return res.data;
};

/* =====================================================
   USER — Fetch own tickets (dashboard)
===================================================== */
export const getMyTickets = async () => {
    const res = await api.get("/tickets/my");
    return res.data;
};

export default { submitTicket, getMyTickets };
