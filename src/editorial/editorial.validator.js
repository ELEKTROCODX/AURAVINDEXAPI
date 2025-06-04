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
  .withMessage("Editorial name is required")
  .isLength({ max: app_config.EDITORIAL_NAME_MAX_LENGTH })
  .withMessage(
    `Editorial name cannot be longer than ${app_config.EDITORIAL_NAME_MAX_LENGTH} characters`
  );

// Default address validation
const address = body("address")
  .isString()
  .notEmpty()
  .withMessage("Editorial address is required")
  .isLength({ max: app_config.EDITORIAL_ADDRESS_MAX_LENGTH })
  .withMessage(
    `Editorial address cannot be longer than ${app_config.EDITORIAL_ADDRESS_MAX_LENGTH} characters`
  );

// Default email validation
const email = body("email")
  .isString()
  .notEmpty()
  .withMessage("Editorial email is required")
  .isEmail()
  .withMessage("Valid email is required")
  .isLength({ max: app_config.EDITORIAL_EMAIL_MAX_LENGTH })
  .withMessage(
    `Editorial email cannot be longer than ${app_config.EDITORIAL_EMAIL_MAX_LENGTH} characters`
  );

// ID validation rules
export const editorial_validation_rules_get_id = [id];

// Fetch editorial by name validation rules
export const editorial_validation_rules_get_name = [
  param("name").isString().notEmpty().withMessage("Editorial name is required"),
];

// POST validation rules
export const editorial_validation_rules_post = [name, address, email];

// PUT validation rules
export const editorial_validation_rules_update = [id, name, address, email];
