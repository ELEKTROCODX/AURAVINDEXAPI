import { body, query, param } from "express-validator";
import { app_config } from "../config/app.config.js";
import { is_valid_birthdate_format } from "../config/util.js";

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
  .withMessage("Author name is required")
  .isLength({ max: app_config.AUTHOR_NAME_MAX_LENGTH })
  .withMessage(
    `Author name cannot be longer than ${app_config.AUTHOR_NAME_MAX_LENGTH} characters`
  );

// Default last name validation
const last_name = body("last_name")
  .isString()
  .notEmpty()
  .withMessage("Author last name is required")
  .isLength({ max: app_config.AUTHOR_LAST_NAME_MAX_LENGTH })
  .withMessage(
    `Author last name cannot be longer than ${app_config.AUTHOR_LAST_NAME_MAX_LENGTH} characters`
  );

// Default birthdate validation
const birthdate = body("birthdate")
  .isString()
  .notEmpty()
  .withMessage("Author birthdate is required")
  .custom((value) => {
    if (!is_valid_birthdate_format(value, true)) {
      throw new Error(`Invalid birthdate format, use yyyy-MM-dd. Note: Author must be at least ${app_config.USER_MIN_AGE_REQUIRED} years old.`);
    }
    return true;
  });

  
// Default gender validation
const gender = body("gender")
  .isString()
  .notEmpty()
  .withMessage("Author gender is required")
  .isMongoId()
  .withMessage("Valid gender ID is required");

// ID validation rules
export const author_validation_rules_get_id = [id];

// Fetch author by name validation rules
export const author_validation_rules_get_name = [
  param("name")
    .isString()
    .notEmpty()
    .withMessage("Author name is required")
    .isLength({ max: app_config.AUTHOR_NAME_MAX_LENGTH })
    .withMessage(
      `Author name cannot be longer than ${app_config.AUTHOR_NAME_MAX_LENGTH} characters`
    ),
];

// POST validation rules
export const author_validation_rules_post = [name, last_name, birthdate, gender];

// PUT validation rules
export const author_validation_rules_update = [id, name, last_name, birthdate, gender];
