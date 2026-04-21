// src/modules/auth/utils/sanitizeUser.js

/**
 * sanitizeUser (User DTO)
 * -----------------------
 * Backend must be the single source of truth.
 * Frontend should receive only what it needs.
 *
 * Always return:
 * { _id, name, email }
 */

export const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;

  // supports mongoose doc or plain object
  const u = typeof userDoc.toObject === "function" ? userDoc.toObject() : userDoc;

  return {
    _id: String(u._id),
    name: u.name || "",
    email: u.email || "",
    role: u.role || "user",
  };
};

export default sanitizeUser;
