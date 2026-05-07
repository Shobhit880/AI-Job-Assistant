function errorHandler(err, req, res, next) {
  const statusCode = err.response?.status || err.statusCode || 500;
  const message = err.response?.data?.detail || err.message || "Internal server error";

  if (process.env.NODE_ENV !== "test") {
    // Keep logging concise and avoid exposing stack traces to clients.
    console.error(err);
  }

  res.status(statusCode).json({
    message,
    details: err.response?.data || undefined,
  });
}

module.exports = errorHandler;
