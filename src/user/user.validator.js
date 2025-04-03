import { body, query, param } from "express-validator";
import { app_config } from "../config/app.config.js";
import { is_valid_birthdate_format, is_valid_date_time_format } from "../config/util.js";

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
  .withMessage("User name is required")
  .isLength({ max: app_config.USER_NAME_MAX_LENGTH })
  .withMessage(
    `User name cannot be longer than ${app_config.USER_NAME_MAX_LENGTH} characters`
  );

// Default last name validation
const last_name = body("last_name")
  .isString()
  .notEmpty()
  .withMessage("User last name is required")
  .isLength({ max: app_config.USER_LAST_NAME_MAX_LENGTH })
  .withMessage(
    `User last name cannot be longer than ${app_config.USER_LAST_NAME_MAX_LENGTH} characters`
  );

// Default email validation
const email = body("email")
  .isEmail()
  .notEmpty()
  .withMessage("User email is required")
  .isLength({ max: app_config.USER_EMAIL_MAX_LENGTH })
  .withMessage(
    `User email cannot be longer than ${app_config.USER_EMAIL_MAX_LENGTH} characters`
  );

// Default biography validation
const biography = body("biography")
  .optional()
  .isLength({ max: app_config.USER_BIOGRAPHY_MAX_LENGTH })
  .withMessage(
    `User biography cannot be longer than ${app_config.USER_BIOGRAPHY_MAX_LENGTH} characters`
  );

// Default gender validation
const gender = body("gender")
  .isString()
  .notEmpty()
  .withMessage("Gender is required")
  .isMongoId()
  .withMessage("Valid gender ID is required");

// Default birthdate validation
const birthdate = body("birthdate")
  .isString()
  .notEmpty()
  .withMessage("User birthdate is required")
  .custom((value) => {
    if (!is_valid_birthdate_format(value)) {
      throw new Error(`Invalid birthdate format, use YYYY-MM-DD. Note: User must be at least ${app_config.USER_MIN_AGE_REQUIRED} years old.`);
    }
    return true;
  });

// Default address validation
const address = body("address")
  .optional()
  .isLength({ max: app_config.USER_ADDRESS_MAX_LENGTH })
  .withMessage(
    `User address cannot be longer than ${app_config.USER_ADDRESS_MAX_LENGTH} characters`
  );

// Default role validation
const role = body("role")
  .optional()
  .isMongoId()
  .withMessage("Valid role ID is required");

// Default password validation
const password = body("password")
  .optional()
  .isLength({ min: app_config.USER_MIN_PASSWORD_LENGTH })
  .withMessage(
    `Password must be at least ${app_config.USER_MIN_PASSWORD_LENGTH} characters long`
  );
/*   .isStrongPassword()
  .withMessage("A stronger password is required") */ // ID validation rules
export const user_validation_rules_get_id = [id];

// POST validation rules
export const user_validation_rules_post = [
  name,
  last_name,
  email,
  biography,
  gender,
  birthdate,
  address,
  role,
  password,
];

// PUT validation rules
export const user_validation_rules_update = [
  id,
  name,
  last_name,
  email,
  biography,
  gender,
  birthdate,
  address,
  role,
  password,
];
// Password reset validation rules
export const user_validation_rules_update_password = [
  body("old_password")
    .exists()
    .notEmpty()
    .withMessage("Old password is required"),
  body("new_password")
    .exists()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: app_config.USER_MIN_PASSWORD_LENGTH })
    .withMessage(
      `Password must be at least ${app_config.USER_MIN_PASSWORD_LENGTH} characters long`
    ),
];
