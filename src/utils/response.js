/**
 * Standardised API response helpers
 */

const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

const sendError = (res, message = "An error occurred", statusCode = 500, errors = null) => {
  const payload = {
    status: "error",
    message,
  };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

module.exports = { sendSuccess, sendError };
