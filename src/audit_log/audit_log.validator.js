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

// Default user ID validation
const user = body("user")
  .optional({ nullable: true })
  .isMongoId()
  .withMessage("Valid user ID is required");

// Default action ID validation
const action = body("action")
  .exists({ checkFalsy: true })
  .isString()
  .notEmpty()
  .withMessage("Action ID or code is required");

// Default action ID validation
const object = body("object")
.exists({ checkFalsy: true })
.isString()
.notEmpty()
.withMessage("Object is required");

// ID validation rules
export const audit_log_validation_rules_get_id = [id];

// POST validation rules
export const audit_log_validation_rules_post = [user, action, object];

// PUT validation rules
export const audit_log_validation_rules_update = [id, user, action, object];
