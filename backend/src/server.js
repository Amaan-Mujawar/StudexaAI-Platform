import "./config/loadEnv.js";
import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";
import AuthThrottle from "./modules/auth/models/AuthThrottle.js";

import bcrypt from "bcryptjs";
import User from "./modules/auth/models/User.js";

const PORT = process.env.PORT || 5000;

/* ─── HTTP + Socket.io setup ─── */
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

/* Inject `io` into every Express request so controllers can emit events */
app.use((req, _res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

/* ─── Admin seeder ─── */
const seedAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn("[startup] Admin credentials missing in .env; skipping seed.");
    return;
  }

  try {
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!existingAdmin) {
      console.log("[startup] Seeding admin user...");
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: "Admin",
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        role: "admin",
      });
      console.log("[startup] Admin user created successfully.");
    } else if (existingAdmin.role !== "admin") {
      console.log("[startup] Updating existing user to admin role...");
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("[startup] Admin role updated successfully.");
    }
  } catch (err) {
    console.error("[startup] Admin seeding failed:", err.message);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await seedAdminUser();

    // Remove stale auththrottles index (key_1) and null-key docs to prevent E11000
    await AuthThrottle.cleanupStaleIndex().catch((err) => {
      console.warn("[startup] AuthThrottle cleanup:", err?.message || err);
    });

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (http + socket.io)`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
