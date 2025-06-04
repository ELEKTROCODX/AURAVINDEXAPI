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

// Default name validation
const name = body("name")
.isString()
.notEmpty()
.withMessage("Plan name is required")
.isLength({ max: app_config.PLAN_NAME_MAX_LENGTH })
.withMessage(
  `Plan name cannot be longer than ${app_config.PLAN_NAME_MAX_LENGTH} characters`
);

// Default fixed price validation
const fixed_price = body("fixed_price")
  .isString()
  .notEmpty()
  .withMessage("Plan fixed price is required");

// Default monthly price validation
const monthly_price = body("monthly_price")
  .isString()
  .notEmpty()
  .withMessage("Plan monthly price is required");

// Default max simultaneous loans validation
const max_simultaneous_loans = body("max_simultaneous_loans")
  .isNumeric()
  .notEmpty()
  .withMessage("Plan max simultaneous loans is required");

// Default max return days validation
const max_return_days = body("max_return_days")
.isNumeric()
.notEmpty()
.withMessage("Plan max return days is required");

// Default max renewals per loan validation
const max_renewals_per_loan = body("max_renewals_per_loan")
 .isNumeric()
 .notEmpty()
 .withMessage("Plan max renovations per loan is required");

// ID validation rules
export const plan_validation_rules_get_id = [id];

// POST validation rules
export const plan_validation_rules_post = [name, fixed_price, monthly_price, max_simultaneous_loans, max_return_days, max_renewals_per_loan];

// PUT validation rules
export const plan_validation_rules_update = [id, name, fixed_price, monthly_price, max_simultaneous_loans, max_return_days, max_renewals_per_loan];