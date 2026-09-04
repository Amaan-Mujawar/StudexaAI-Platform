// src/api/ticketsApi.js
import api from "../services/api.js";

/* =====================================================
   GUEST — Submit ticket from public Contact page
   POST /api/tickets/guest
   - No auth credentials attached (route enforces this)
   - Name + email come from the form fields
===================================================== */
export const submitGuestTicket = async (data) => {
    const res = await api.post("/tickets/guest", data);
    return res.data;
};

/* =====================================================
   AUTHENTICATED USER — Submit ticket from dashboard
   POST /api/tickets/authenticated
   - Requires valid session (protect middleware on backend)
   - Name + email pre-filled from auth context
===================================================== */
export const submitAuthenticatedTicket = async (data) => {
    const res = await api.post("/tickets/authenticated", data);
    return res.data;
};

/* =====================================================
   AUTHENTICATED USER — Fetch own tickets (dashboard)
   GET /api/tickets/my
===================================================== */
export const getMyTickets = async () => {
    const res = await api.get("/tickets/my");
    return res.data;
};

export default { submitGuestTicket, submitAuthenticatedTicket, getMyTickets };
