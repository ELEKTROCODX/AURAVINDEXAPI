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

// Default title validation
const title = body("title")
  .isString()
  .notEmpty()
  .withMessage("Book list title is required")
  .isLength({ max: app_config.BOOK_LIST_TITLE_MAX_LENGTH })
  .withMessage(
    `Book list title cannot be longer than ${app_config.BOOK_LIST_TITLE_MAX_LENGTH} characters`
  );

// Default title validation
const description = body("description")
  .isString()
  .notEmpty()
  .withMessage("Book list description is required")
  .isLength({ max: app_config.BOOK_LIST_DESCRIPTION_MAX_LENGTH })
  .withMessage(
    `Book list description cannot be longer than ${app_config.BOOK_LIST_DESCRIPTION_MAX_LENGTH} characters`
  );

// Default owner validation
const owner = body("owner")
.isString()
.notEmpty()
.withMessage("Book list owner is required")
.isMongoId()
.withMessage("Valid owner ID is required");



// ID validation rules
export const book_list_validation_rules_get_id = [id];

// Fetch book_list collection by title validation rules
export const book_list_validation_rules_get_title = [
  param("title").isString().notEmpty().withMessage("Book list title is required"),
];

// POST validation rules
export const book_list_validation_rules_post = [title, description, owner];

// PUT validation rules
export const book_list_validation_rules_update = [id, title, description, owner];

// POST/REMOVE book validation rules
export const book_validation_rules = [
  param("book_list_id")
    .isString()
    .notEmpty()
    .withMessage("Book list ID is required")
    .isMongoId()
    .withMessage("Valid book list ID is required"),
  param("book_id")
    .isString()
    .notEmpty()
    .withMessage("Book ID is required")
    .isMongoId()
    .withMessage("Valid book ID is required"),
];
