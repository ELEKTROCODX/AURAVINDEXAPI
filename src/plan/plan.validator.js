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

// Default price validation
const price = param("price")
  .isDecimal()
  .notEmpty()
  .withMessage("Plan price is required");

// Default max simultaneous loans validation
const max_simultaneous_loans = param("max_simultaneous_loans")
  .isNumeric()
  .notEmpty()
  .withMessage("Plan max simultaneous loans is required");

// Default max return days validation
const max_return_days = param("max_return_days")
.isNumeric()
.notEmpty()
.withMessage("Plan max return days is required");

// Default max renovations per loan validation
const max_renovations_per_loan = param("max_renovations_per_loan")
 .isNumeric()
 .notEmpty()
 .withMessage("Plan max renovations per loan is required");

// ID validation rules
export const plan_validation_rules_get_id = [id];

// POST validation rules
export const plan_validation_rules_post = [name, price, max_simultaneous_loans, max_return_days, max_renovations_per_loan];

// PUT validation rules
export const plan_validation_rules_update = [id, name, price, max_simultaneous_loans, max_return_days, max_renovations_per_loan];