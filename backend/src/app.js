// src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import notFound from "./middleware/notFound.middleware.js";
import errorHandler from "./middleware/error.middleware.js";

/* ================= MODULE ROUTES ================= */
import authRoutes from "./modules/auth/routes/auth.routes.js";
import todoRoutes from "./modules/todos/routes/todo.routes.js";
import aiRoutes from "./modules/ai/routes/ai.routes.js";
import quizRoutes from "./modules/quiz/routes/quiz.routes.js";
import dashboardRoutes from "./dashboard/routes/dashboard.routes.js";

import logicalReasoningRoutes from "./modules/practices/logicalReasoning/routes/logicalReasoning.routes.js";
import aptitudeRoutes from "./modules/practices/aptitude/routes/aptitude.routes.js";
import verbalReasoningRoutes from "./modules/practices/verbalReasoning/routes/verbalReasoning.routes.js";
import contestRoutes from "./modules/contest/routes/contest.routes.js";

/* ================= ADMIN ================= */
import adminRoutes from "./modules/admin/routes/admin.routes.js";
import publicContentRoutes from "./modules/admin/routes/publicContentRoutes.js";

/* ================= USER / TICKETS ================= */
import userRoutes from "./modules/user/routes/user.routes.js";
import ticketRoutes from "./modules/tickets/routes/ticket.routes.js";

const app = express();

app.set("trust proxy", 1);

/* ================= STRICT CORS LOCKDOWN ================= */
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  process.env.NODE_ENV !== "production" ? "http://localhost:5173" : null,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS policy: Unauthorized Origin"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ================= ROUTES ================= */
app.get("/", (req, res) => {
  res.send("StudexaAI Platform API Running");
});

/* Core feature routes (prefixes MUST remain unchanged) */
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* Practice routes */
app.use("/api/logical-reasoning", logicalReasoningRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/verbal-reasoning", verbalReasoningRoutes);

/* Contest routes */
app.use("/api/contest", contestRoutes);

/* Public Content (published by admin) */
app.use("/api/content", publicContentRoutes);

/* User Settings/Profile */
app.use("/api/user", userRoutes);

/* Support Tickets (public submit + authenticated user view) */
app.use("/api/tickets", ticketRoutes);

/* Admin module */
app.use("/api/admin", adminRoutes);

/* ================= ERROR MIDDLEWARE ================= */
app.use(notFound);
app.use(errorHandler);

export default app;
