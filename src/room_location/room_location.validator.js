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

// Default location validation
const location = body("location")
  .isString()
  .notEmpty()
  .withMessage("Room location is required");

// ID validation rules
export const room_location_validation_rules_get_id = [id];

// POST validation rules
export const room_location_validation_rules_post = [location];

// PUT validation rules
export const room_location_validation_rules_update = [id, location];
