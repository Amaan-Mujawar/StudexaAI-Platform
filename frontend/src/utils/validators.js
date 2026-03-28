// frontend/src/utils/validators.js

/* =====================================================
   NAME VALIDATION
===================================================== */
export const validateName = (name) => {
  if (!name || typeof name !== "string") return "Name is required";

  const trimmed = name.trim();

  if (trimmed.length < 3) return "Name must be at least 3 characters long";
  if (trimmed.length > 50) return "Name must not exceed 50 characters";

  const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

  if (!nameRegex.test(trimmed)) {
    return "Name can contain only alphabets and single spaces (no numbers or symbols)";
  }

  return null;
};

/* =====================================================
   EMAIL VALIDATION
===================================================== */
export const validateEmail = (email) => {
  if (!email || typeof email !== "string") return "Email is required";

  const trimmed = email.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailRegex.test(trimmed)) return "Invalid email format";

  return null;
};

/* =====================================================
   PASSWORD VALIDATION
===================================================== */
export const validatePassword = (password) => {
  if (!password || typeof password !== "string") return "Password is required";

  if (password.length < 8) return "Password must be at least 8 characters long";
  if (/\s/.test(password)) return "Password must not contain spaces";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";

  if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;/]/.test(password)) {
    return "Password must contain at least one special character";
  }

  return null;
};
