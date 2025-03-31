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
  .withMessage("Equipment name is required")
  .isLength({ max: app_config.EQUIPMENT_NAME_MAX_LENGTH })
  .withMessage(
    `Equipment name cannot be longer than ${app_config.EQUIPMENT_NAME_MAX_LENGTH} characters`
  );

// Default inventory validation
const inventory = body("inventory")
  .isString()
  .notEmpty()
  .withMessage("Equipment inventory is required")
  .isLength({ max: app_config.EQUIPMENT_INVENTORY_MAX_LENGTH })
  .withMessage(
    `Equipment inventory cannot be longer than ${app_config.EQUIPMENT_INVENTORY_MAX_LENGTH} characters`
  );

// Default brand validation
const brand = body("brand")
  .isString()
  .notEmpty()
  .withMessage("Equipment brand is required")
  .withMessage("Valid brand is required")
  .isLength({ max: app_config.EQUIPMENT_BRAND_MAX_LENGTH })
  .withMessage(
    `Equipment brand cannot be longer than ${app_config.EQUIPMENT_BRAND_MAX_LENGTH} characters`
  );

// ID validation rules
export const equipment_validation_rules_get_id = [id];

// Fetch equipment by name validation rules
export const equipment_validation_rules_get_name = [
  param("name")
    .isString()
    .notEmpty()
    .withMessage("Equipment name is required"),
];

// POST validation rules
export const equipment_validation_rules_post = [name, inventory, brand];

// PUT validation rules
export const equipment_validation_rules_update = [id, name, inventory, brand];
