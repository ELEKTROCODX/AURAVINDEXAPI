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

// Default receiver validation
const receiver = body("receiver")
  .isString()
  .notEmpty()
  .withMessage("Receiver is required")
  .isMongoId()
  .withMessage("Valid receiver ID is required");

// Default title validation
const title = body("title")
  .isString()
  .notEmpty()
  .withMessage("Notification title is required")
  .isLength({ max: app_config.NOTIFICATION_TITLE_MAX_LENGTH })
  .withMessage(
    `Notification title cannot be longer than ${app_config.NOTIFICATION_TITLE_MAX_LENGTH} characters`
  );

// Default message validation
const message = body("message")
  .isString()
  .notEmpty()
  .withMessage("Notification message is required")
  .isLength({ max: app_config.NOTIFICATION_MESSAGE_MAX_LENGTH })
  .withMessage(
    `Notification message cannot be longer than ${app_config.NOTIFICATION_MESSAGE_MAX_LENGTH} characters`
  );

// Default notification type validation
const notification_type = body("notification_type")
  .isString()
  .notEmpty()
  .withMessage("Notification type is required")
  .isLength({ max: app_config.NOTIFICATION_TYPE_MAX_LENGTH })
  .withMessage(
    `Notification type cannot be longer than ${app_config.NOTIFICATION_TYPE_MAX_LENGTH} characters`
  );

// Default is_read validation
const is_read = body("is_read")
  .isBoolean()
  .optional()
  .withMessage("Is read must be a boolean value");

// ID validation rules
export const notification_validation_rules_get_id = [id];

// POST validation rules
export const notification_validation_rules_post = [receiver, title, message , notification_type, is_read];

// PUT validation rules
export const notification_validation_rules_update = [id, receiver, title, message, notification_type, is_read];