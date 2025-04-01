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

// Default title validation
const title = body("title")
  .isString()
  .notEmpty()
  .withMessage("Notification title is required")
  .isLength({ max: app_config.NOTIFICATION_TITLE_MAX_LENGTH })
  .withMessage(
    `Notification title cannot be longer than ${app_config.NOTIFICATION_TITLE_MAX_LENGTH} characters`
  );

// Default description validation
const description = body("description")
.isString()
.notEmpty()
.withMessage("Notification description is required")
.isLength({ max: app_config.NOTIFICATION_DESCRIPTION_MAX_LENGTH })
.withMessage(
  `Notification description cannot be longer than ${app_config.NOTIFICATION_DESCRIPTION_MAX_LENGTH} characters`
);


// ID validation rules
export const notification_validation_rules_get_id = [id];

// POST validation rules
export const notification_validation_rules_post = [sender, receiver, title, description];

// PUT validation rules
export const notification_validation_rules_update = [id, sender, receiver, title, description];