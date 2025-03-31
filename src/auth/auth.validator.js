import { body, query, param } from "express-validator";
import { app_config } from "../config/app.config.js";

/* Login validation rules*/
export const login_validation_rules = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: app_config.USER_MIN_PASSWORD_LENGTH })
    .withMessage(
      `Password must be at least ${app_config.USER_MIN_PASSWORD_LENGTH} characters long`
    ),
];

/* Request password reset validation rules */
export const user_validation_rules_request_password_reset = [
  body("email").isEmail().notEmpty().withMessage("Invalid email address"),
];
/* Reset password from token link validation rules */
export const user_validation_rules_reset_password = [
  body("token")
    .exists()
    .notEmpty()
    .withMessage('Token is required'),
  body("password")
    .exists()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: app_config.USER_MIN_PASSWORD_LENGTH })
    .withMessage(
      `Password must be at least ${app_config.USER_MIN_PASSWORD_LENGTH} characters long`
    ),
];
