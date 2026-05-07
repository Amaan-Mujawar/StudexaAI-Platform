// src/middleware/notFound.middleware.js

/**
 * Not Found Middleware
 * --------------------
 * Contract rule:
 * - Always return { message }
 * - Status: 404
 */

const notFound = (req, res, next) => {
  res.status(404).json({
    message: "Not Found",
  });
};

export default notFound;
