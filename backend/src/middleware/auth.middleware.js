
import jwt from "jsonwebtoken";
import User from "../modules/auth/models/User.js";
import { sanitizeUser } from "../modules/auth/utils/sanitizeUser.js";

const protect = async (req, res, next) => {
  let token = req.cookies?.jwt;

  // Fallback to Authorization header (Bearer token)
  if (!token && req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* =======================
        ADMIN SHORT-CIRCUIT
    ======================== */
    const isAdminToken =
      decoded?.role === "admin" &&
      decoded?.email?.toLowerCase() ===
      process.env.ADMIN_EMAIL?.toLowerCase();

    if (isAdminToken) {
      console.log(`[AuthMiddleware] Admin short-circuit: ${decoded.email}`);
      req.user = {
        _id: decoded.userId || "admin_id",
        name: "Admin",
        email: decoded.email,
        role: "admin",
      };
      return next();
    }

    /* =======================
        REGULAR USER
    ======================== */
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Attach clean user only
    req.user = sanitizeUser(user);
    req.user.role = "user"; // normalize role for downstream checks

    return next();
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired" });
    }

    return res.status(401).json({ message: "Not authorized" });
  }
};

export default protect;