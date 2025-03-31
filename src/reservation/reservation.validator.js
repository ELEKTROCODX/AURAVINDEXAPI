import { body, query, param } from "express-validator";
import { app_config } from "../config/app.config.js";
import { is_valid_date_time_format } from "../config/util.js";

// Default ID validation
const id = param("id")
  .exists({ checkFalsy: true })
  .isString()
  .notEmpty()
  .withMessage("ID is required")
  .isMongoId()
  .withMessage("Valid ID is required");

// Default user validation
const user = body("user")
  .isString()
  .notEmpty()
  .withMessage("User is required")
  .isMongoId()
  .withMessage("Valid user ID is required");

// Default reservation validation
const room = body("room")
  .isString()
  .notEmpty()
  .withMessage("Room is required")
  .isMongoId()
  .withMessage("Valid room ID is required");

// Default start date validation
const start_date = body("start_date")
  .isString()
  .notEmpty()
  .withMessage("Reservation start date is required")
  .custom((value) => {
    if (!is_valid_date_time_format(value)) {
      throw new Error("Invalid start date format, use YYYY-MM-DD HH:MM");
    }
    return true;
  });

// Default finish date validation
const finish_date = body("finish_date")
  .isString()
  .notEmpty()
  .withMessage("Reservation finish date is required")
  .custom((value) => {
    if (!is_valid_date_time_format(value)) {
      throw new Error("Invalid finish date format, use YYYY-MM-DD HH:MM");
    }
    return true;
  });

// Default people validation
const people = body("people")
  .isInt()
  .notEmpty()
  .withMessage("People is required");

// ID validation rules
export const reservation_validation_rules_get_id = [id];

// POST validation rules
export const reservation_validation_rules_post = [
  user,
  room,
  start_date,
  finish_date,
  people,
];

// PUT validation rules
export const reservation_validation_rules_update = [
  id,
  user,
  room,
  start_date,
  finish_date,
  people,
];
