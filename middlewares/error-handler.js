const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

export default errorHandler;
