// src/utils/asyncHandler.js

/**
 * Async Handler Wrapper
 * ---------------------
 * Wrap async express handlers to avoid repetitive try/catch
 * and forward errors to global error middleware.
 *
 * Guarantees:
 * - Any thrown error is routed to next(err)
 * - No contract-breaking responses here
 *
 * @param {(req,res,next)=>Promise<any>} fn
 */
const asyncHandler = (fn) => {
  if (typeof fn !== "function") {
    throw new TypeError("asyncHandler expects a function");
  }

  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
