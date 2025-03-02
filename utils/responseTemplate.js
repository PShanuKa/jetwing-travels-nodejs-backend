export const responseTemplate = (res, status, message, data, meta) => {
  return res.status(status || 200).json({
    message,
    data,
    success: true,
    meta,
  });
};

export const errorResponseTemplate = (res, status, message, next) => {
  const error = new Error(message);
  error.status = status;

  if (typeof next === "function") {
    next(error); 
  } else {

    res.status(status).json({
      success: false,
      message,
    });
  }
};