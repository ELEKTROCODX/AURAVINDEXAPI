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
  .exists({ checkFalsy: true })
  .isString()
  .notEmpty()
  .withMessage("Room name is required")
  .isLength({ max: app_config.ROOM_NAME_MAX_LENGTH })
  .withMessage(
    `Room name cannot be longer than ${app_config.ROOM_NAME_MAX_LENGTH} characters`
  );

// Default min people validation
const min_people = body("min_people")
  .exists({ checkFalsy: true })
  .isInt()
  .notEmpty()
  .withMessage("Room min people is required");

// Default max people validation
const max_people = body("max_people")
  .exists({ checkFalsy: true })
  .isInt()
  .notEmpty()
  .withMessage("Room max people is required");

// Default room location validation
const room_location = body("room_location")
  .isString()
  .notEmpty()
  .withMessage("Room location is required")
  .isMongoId()
  .withMessage("Valid room location ID is required");

// Default status validation
const room_status = body("room_status")
  .isString()
  .notEmpty()
  .withMessage("Room status is required")
  .isMongoId()
  .withMessage("Valid room status ID is required");

// ID validation rules
export const room_validation_rules_get_id = [id];

// Fetch room by name validation rules
export const room_validation_rules_get_name = [
  param("name")
    .exists({ checkFalsy: true })
    .isString()
    .notEmpty()
    .withMessage("Room name is required"),
];

// POST validation rules
export const room_validation_rules_post = [
  name,
  min_people,
  max_people,
  room_location,
  room_status,
];

// PUT validation rules
export const room_validation_rules_update = [
  id,
  name,
  min_people,
  max_people,
  room_location,
  room_status,
];
