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

// Default type validation
const alert_type = body("alert_type")
  .isString()
  .notEmpty()
  .withMessage("Alert type is required")
  .isMongoId()
  .withMessage("Valid alert type ID is required");

// Default sender validation
const sender = body("sender")
  .isString()
  .notEmpty()
  .withMessage("Sender is required")
  .isMongoId()
  .withMessage("Valid sender ID is required");

// Default receiver validation
const receiver = body("receiver")
  .isString()
  .notEmpty()
  .withMessage("Receiver is required")
  .isMongoId()
  .withMessage("Valid receiver ID is required");


// ID validation rules
export const alert_validation_rules_get_id = [id];

// POST validation rules
export const alert_validation_rules_post = [alert_type, sender, receiver];

// PUT validation rules
export const alert_validation_rules_update = [id, alert_type, sender, receiver];
