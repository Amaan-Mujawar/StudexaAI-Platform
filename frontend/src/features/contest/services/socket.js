// src/features/contest/services/socket.js
// Module-level singleton — survives React StrictMode double-invokes
import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
    if (!socket) {
        const rawUrl = (import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "").replace(/\/+$/, "");
        socket = io(rawUrl || undefined, {
            withCredentials: true,
            transports: ["websocket", "polling"],
            autoConnect: false, // connect manually so we control timing
        });
    }
    return socket;
};

export const connectSocket = () => {
    const s = getSocket();
    if (!s.connected) s.connect();
    return s;
};

export const disconnectSocket = () => {
    if (socket?.connected) socket.disconnect();
};
