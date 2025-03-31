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

// Default status validation
const status = body("room_status")
  .isString()
  .notEmpty()
  .withMessage("Room status is required");

// ID validation rules
export const room_status_validation_rules_get_id = [id];

// Fetch room status by status validation rules
export const room_status_validation_rules_get_status = [
  param("status")
    .exists({ checkFalsy: true })
    .isString()
    .notEmpty()
    .withMessage("Room status is required"),
];

// POST validation rules
export const room_status_validation_rules_post = [status];

// PUT validation rules
export const room_status_validation_rules_update = [id, status];
