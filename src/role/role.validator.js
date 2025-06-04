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
  .withMessage("Role name is required")
  .isLength({ max: app_config.ROLE_NAME_MAX_LENGTH })
  .withMessage(
    `Role name cannot be longer than ${app_config.ROLE_NAME_MAX_LENGTH} characters`
  );

// ID validation rules
export const role_validation_rules_get_id = [id];

// Fetch book collection by name validation rules
export const role_validation_rules_get_name = [
  param("name").isString().notEmpty().withMessage("Role name is required"),
];

// POST validation rules
export const role_validation_rules_post = [name];

// PUT validation rules
export const role_validation_rules_update = [id, name];

// POST/REMOVE permission validation rules
export const permission_validation_rules = [
  param("id")
    .isString()
    .notEmpty()
    .withMessage("Role ID is required")
    .isMongoId()
    .withMessage("Valid role ID is required"),
  body("permission_code")
    .isString()
    .notEmpty()
    .withMessage("Permission code is required"),
];
