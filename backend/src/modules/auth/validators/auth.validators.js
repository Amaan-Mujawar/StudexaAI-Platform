// src/modules/auth/validators/auth.validators.js
import {
  validateName,
  validateEmail,
  validatePassword,
} from "../../../utils/validators.js";

/* =====================================================
   COMMON HELPERS
===================================================== */
const ensure = (condition, message) => {
  if (!condition) return message;
  return null;
};

/* =====================================================
   REGISTER
   body: { name, email, password }
===================================================== */
export const validateRegisterPayload = ({ name, email, password }) => {
  let error;

  error = ensure(name, "Name is required");
  if (error) return error;

  error = validateName(name);
  if (error) return error;

  error = ensure(email, "Email is required");
  if (error) return error;

  error = validateEmail(email);
  if (error) return error;

  error = ensure(password, "Password is required");
  if (error) return error;

  error = validatePassword(password);
  if (error) return error;

  return null;
};

/* =====================================================
   LOGIN
   body: { email, password }
===================================================== */
export const validateLoginPayload = ({ email, password }) => {
  let error;

  error = ensure(email, "Email is required");
  if (error) return error;

  error = validateEmail(email);
  if (error) return error;

  error = ensure(password, "Password is required");
  if (error) return error;

  return null;
};

/* =====================================================
   EMAIL + OTP (REGISTER / LOGIN / RESET VERIFY)
   body: { email, otp }
===================================================== */
export const validateEmailOtpPayload = ({ email, otp }) => {
  let error;

  error = ensure(email, "Email is required");
  if (error) return error;

  error = validateEmail(email);
  if (error) return error;

  error = ensure(otp, "OTP is required");
  if (error) return error;

  if (!/^\d{6}$/.test(String(otp))) {
    return "OTP must be a 6-digit number";
  }

  return null;
};

/* =====================================================
   FORGOT PASSWORD (REQUEST RESET)
   body: { email }
===================================================== */
export const validateForgotPasswordPayload = ({ email }) => {
  let error;

  error = ensure(email, "Email is required");
  if (error) return error;

  error = validateEmail(email);
  if (error) return error;

  return null;
};

/* =====================================================
   RESET PASSWORD
   body: { email, newPassword }
===================================================== */
export const validateResetPasswordPayload = ({
  email,
  newPassword,
}) => {
  let error;

  error = ensure(email, "Email is required");
  if (error) return error;

  error = validateEmail(email);
  if (error) return error;

  error = ensure(newPassword, "New password is required");
  if (error) return error;

  error = validatePassword(newPassword);
  if (error) return error;

  return null;
};

/* =====================================================
   RESEND OTP
   body: { email, type }
===================================================== */
export const validateResendOtpPayload = ({ email, type }) => {
  let error;

  error = ensure(email, "Email is required");
  if (error) return error;

  error = validateEmail(email);
  if (error) return error;

  if (!type || !["register", "login", "reset"].includes(type)) {
    return "Invalid OTP resend type";
  }

  return null;
};
