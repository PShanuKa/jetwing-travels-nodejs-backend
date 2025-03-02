export const errorHandler = (err, req, res, next) => {
  console.error("Error Stack:", err.stack);
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

// API Not Found Middleware
export const notFound = (req, res, next) => {
  const error = new Error(`API Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};