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
const code = body("action_code")
  .isString()
  .notEmpty()
  .withMessage("Action code is required");

// ID validation rules
export const log_action_validation_rules_get_id = [id];

// POST validation rules
export const log_action_validation_rules_post = [code];

// PUT validation rules
export const log_action_validation_rules_update = [id, code];
