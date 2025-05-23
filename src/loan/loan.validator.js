import { body, query, param } from "express-validator";
import { app_config } from "../config/app.config.js";
import { is_valid_date_time_format } from "../config/util.js";

// Default ID validation
const id = param("id")
  .exists({ checkFalsy: true })
  .isString()
  .notEmpty()
  .withMessage("ID is required")
  .isMongoId()
  .withMessage("Valid ID is required");

// Default user validation
const user = body("user")
  .isString()
  .notEmpty()
  .withMessage("User is required")
  .isMongoId()
  .withMessage("Valid user ID is required");

// Default book validation
const book = body("book")
  .isString()
  .notEmpty()
  .withMessage("Book is required")
  .isMongoId()
  .withMessage("Valid book ID is required");

// Default loan status validation
const loan_status = body("book")
  .isString()
  .notEmpty()
  .withMessage("Loan status is required")
  .isMongoId()
  .withMessage("Valid loan status ID is required");

// Default return date validation
const return_date = body("return_date")
  .optional()
  .isISO8601() // ISO 8601 (YYYY-MM-DD)
  .withMessage("Invalid date format, use YYYY-MM-DD");

// Default returned date validation
const returned_date = body("returned_date")
  .optional()
  .custom((value) => {
    if (!is_valid_date_time_format(value)) {
      throw new Error("Invalid returned date format, use YYYY-MM-DD HH:MM");
    }
    return true;
  });

// Default renewals validation
const renewals = body("renewals")
  .optional()
  .isInt({ max: app_config.LOAN_MAX_RENEWALS_PER_LOAN})
  .withMessage(`Renewals cannot be greater than ${app_config.LOAN_MAX_RENEWALS_PER_LOAN}`);

// ID validation rules
export const loan_validation_rules_get_id = [id];

// POST validation rules
export const loan_validation_rules_post = [user, book, loan_status,  return_date, returned_date, renewals];

// PUT validation rules
export const loan_validation_rules_update = [id, user, book, loan_status, return_date, returned_date, renewals];
