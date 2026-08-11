import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Middleware to protect admin routes
 * 1. Checks for JWT in cookies or authorization header
 * 2. Decodes token and verifies if role is 'admin'
 * 3. Verifies if email matches hardcoded ADMIN_EMAIL
 */
const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in cookies (preferred for Studexa backend)
  if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  // Else check Authorization header
  else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    const error = new Error("Not authorized to access this route");
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const isRoleMatch  = decoded.role === "admin";
    const isEmailMatch = decoded.email?.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();

    if (!isRoleMatch || !isEmailMatch) {
      const error = new Error("Access denied: Admin privileges required");
      error.statusCode = 403;
      throw error;
    }

    req.user = {
      _id:   decoded.userId || "admin_id",
      email: decoded.email,
      role:  "admin",
    };

    next();
  } catch (err) {
    const error = new Error("Not authorized to access this route");
    error.statusCode = 401;
    throw error;
  }
});

export default protectAdmin;
