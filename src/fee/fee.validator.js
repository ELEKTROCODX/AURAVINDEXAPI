import { body, query, param } from "express-validator";
import { app_config } from "../config/app.config.js";

// Default ID validation
const id = param("id")
  .exists({ checkFalsy: true })
  .isString()
  .notEmpty()
  .withMessage("ID is required")
  .isMongoId()
  .withMessage("Valid ID is required");

// Default type validation
const fee_type = body("fee_type")
  .isString()
  .notEmpty()
  .withMessage("Fee type is required")
  .isMongoId()
  .withMessage("Valid fee type ID is required");

// Default status validation
const fee_status = body("fee_status")
  .isString()
  .notEmpty()
  .withMessage("Fee status is required")
  .isMongoId()
  .withMessage("Valid fee status ID is required");

// Default loan validation
const loan = body("loan")
  .isString()
  .notEmpty()
  .withMessage("Loan is required")
  .isMongoId()
  .withMessage("Valid loan ID is required");

// Default paid date validation
const paid_date = body("paid_date")
  .optional()
  .custom((value) => {
    if (!isValidDateTimeFormat(value)) {
      throw new Error("Invalid paid date format, use YYYY-MM-DD HH:MM");
    }
    return true;
  });

// Default due payment date validation
const due_payment_date = body("due_payment_date")
  .isString()
  .notEmpty()
  .withMessage("Fee due payment date is required")
  .isISO8601() // ISO 8601 (YYYY-MM-DD)
  .withMessage("Invalid due payment date format, use YYYY-MM-DD");

// ID validation rules
export const fee_validation_rules_get_id = [id];

// POST validation rules
export const fee_validation_rules_post = [
  fee_type,
  fee_status,
  loan,
  paid_date,
  due_payment_date,
];

// PUT validation rules
export const fee_validation_rules_update = [
  id,
  fee_type,
  fee_status,
  loan,
  paid_date,
  due_payment_date,
];
