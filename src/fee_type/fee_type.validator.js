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

// Default code validation
const code = body("fee_code")
  .isString()
  .notEmpty()
  .withMessage("Fee code is required");

// Default message validation
const message = body("message")
  .isString()
  .notEmpty()
  .withMessage("Fee message is required")
  .isLength({ max: app_config.FEE_TYPE_MESSAGE_MAX_LENGTH })
  .withMessage(
    `Fee message cannot be longer than ${app_config.FEE_TYPE_MESSAGE_MAX_LENGTH} characters`
  );

// Default cost validation
const cost = body("cost")
  .isDecimal()
  .notEmpty()
  .withMessage("Fee cost is required")

// ID validation rules
export const fee_type_validation_rules_get_id = [id];

// Fetch fee type by code validation rules
export const fee_type_validation_rules_get_code = [
  param("code")
    .exists({ checkFalsy: true })
    .isString()
    .notEmpty()
    .withMessage("Fee code is required"),
];

// POST validation rules
export const fee_type_validation_rules_post = [code, message];

// PUT validation rules
export const fee_type_validation_rules_update = [id, code, message, cost];
