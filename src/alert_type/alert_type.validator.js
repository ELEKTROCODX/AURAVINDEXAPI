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
const code = body("alert_code")
  .isString()
  .notEmpty()
  .withMessage("Alert code is required");

// Default message validation
const message = body("message")
  .isString()
  .notEmpty()
  .withMessage("Alert message is required")
  .isLength({ max: app_config.ALERT_TYPE_MESSAGE_MAX_LENGTH })
  .withMessage(
    `Alert message cannot be longer than ${app_config.ALERT_TYPE_MESSAGE_MAX_LENGTH} characters`
  );

// ID validation rules
export const alert_type_validation_rules_get_id = [id];

// Fetch alert type by code validation rules
export const alert_type_validation_rules_get_code = [
  param("code")
    .exists({ checkFalsy: true })
    .isString()
    .notEmpty()
    .withMessage("Alert code is required"),
];

// POST validation rules
export const alert_type_validation_rules_post = [code, message];

// PUT validation rules
export const alert_type_validation_rules_update = [id, code, message];
