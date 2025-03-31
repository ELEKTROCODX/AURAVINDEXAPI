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
  .withMessage("Gender name is required")
  .isLength({ max: app_config.GENDER_NAME_MAX_LENGTH })
  .withMessage(
    `Gender cannot be longer than ${app_config.GENDER_NAME_MAX_LENGTH} characters`
  );

// ID validation rules
export const gender_validation_rules_get_id = [id];

// Fetch gender by name validation rules
export const gender_validation_rules_get_name = [
  param("name")
    .isString()
    .notEmpty()
    .withMessage("Gender name is required")
    .isLength({ max: app_config.GENDER_NAME_MAX_LENGTH })
    .withMessage(
      `Gender cannot be longer than ${app_config.GENDER_NAME_MAX_LENGTH} characters`
    ),
];

// POST validation rules
export const gender_validation_rules_post = [name];

// PUT validation rules
export const gender_validation_rules_update = [id, name];
