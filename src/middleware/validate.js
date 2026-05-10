const { body, query, validationResult } = require("express-validator");
const { sendError } = require("../utils/response");

// ── Validation Rules ──────────────────────────────────────────────────────────

const addSchoolRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("School name is required")
    .isLength({ min: 2, max: 255 }).withMessage("Name must be between 2 and 255 characters"),

  body("address")
    .trim()
    .notEmpty().withMessage("Address is required")
    .isLength({ min: 5, max: 500 }).withMessage("Address must be between 5 and 500 characters"),

  body("latitude")
    .notEmpty().withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 }).withMessage("Latitude must be a number between -90 and 90"),

  body("longitude")
    .notEmpty().withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 }).withMessage("Longitude must be a number between -180 and 180"),
];

const listSchoolsRules = [
  query("latitude")
    .notEmpty().withMessage("latitude query parameter is required")
    .isFloat({ min: -90, max: 90 }).withMessage("latitude must be a number between -90 and 90"),

  query("longitude")
    .notEmpty().withMessage("longitude query parameter is required")
    .isFloat({ min: -180, max: 180 }).withMessage("longitude must be a number between -180 and 180"),
];

// ── Result Handler ────────────────────────────────────────────────────────────

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(
      res,
      "Validation failed",
      422,
      errors.array().map((e) => ({ field: e.path, message: e.msg }))
    );
  }
  next();
};

module.exports = { addSchoolRules, listSchoolsRules, validate };
