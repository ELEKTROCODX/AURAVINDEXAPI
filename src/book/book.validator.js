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
  .withMessage("Book title is required")
  .isLength({ max: app_config.BOOK_TITLE_MAX_LENGTH })
  .withMessage(
    `Book title cannot be longer than ${app_config.BOOK_TITLE_MAX_LENGTH} characters`
  );

// Default isbn validation
const isbn = body("isbn")
  .isString()
  .notEmpty()
  .withMessage("Book ISBN is required")
  .isLength({ max: app_config.BOOK_ISBN_MAX_LENGTH })
  .withMessage(
    `Book ISBN cannot be longer than ${app_config.BOOK_ISBN_MAX_LENGTH} characters`
  );

// Default classification validation
const classification = body("classification")
  .isString()
  .notEmpty()
  .withMessage("Book classification is required")
  .isLength({ max: app_config.BOOK_CLASSIFICATION_MAX_LENGTH })
  .withMessage(
    `Book classification cannot be longer than ${app_config.BOOK_CLASSIFICATION_MAX_LENGTH} characters`
  );

// Default summary validation
const summary = body("summary")
  .isString()
  .notEmpty()
  .withMessage("Book summary is required")
  .isLength({ max: app_config.BOOK_SUMMARY_MAX_LENGTH })
  .withMessage(
    `Book summary cannot be longer than ${app_config.BOOK_SUMMARY_MAX_LENGTH} characters`
  );

// Default editorial validation
const editorial = body("editorial")
  .isString()
  .notEmpty()
  .withMessage("Book editorial is required")
  .isMongoId()
  .withMessage("Valid editorial ID is required");

// Default language validation
const language = body("language")
  .isString()
  .notEmpty()
  .withMessage("Book language is required")
  .isLength({ max: app_config.BOOK_SUMMARY_MAX_LENGTH })
  .withMessage(
    `Book language cannot be longer than ${app_config.BOOK_SUMMARY_MAX_LENGTH} characters`
  );

// Default edition validation
const edition = body("edition")
  .isString()
  .notEmpty()
  .withMessage("Book edition is required")
  .isLength({ max: app_config.BOOK_EDITION_MAX_LENGTH })
  .withMessage(
    `Book edition cannot be longer than ${app_config.BOOK_EDITION_MAX_LENGTH} characters`
  );

// Default age restriction validation
const age_restriction = body("age_restriction")
  .isString()
  .notEmpty()
  .withMessage("Book age restriction is required")
  .isLength({ max: app_config.BOOK_AGE_RESTRICTION_MAX_LENGTH })
  .withMessage(
    `Book age restriction cannot be longer than ${app_config.BOOK_AGE_RESTRICTION_MAX_LENGTH} characters`
  );

// Default sample validation
const sample = body("sample")
  .isString()
  .notEmpty()
  .withMessage("Book sample is required")
  .isLength({ max: app_config.BOOK_SAMPLE_MAX_LENGTH })
  .withMessage(
    `Book sample cannot be longer than ${app_config.BOOK_SAMPLE_MAX_LENGTH} characters`
  );

// Default location validation
const location = body("location")
  .isString()
  .notEmpty()
  .withMessage("Book location is required")
  .isLength({ max: app_config.BOOK_LOCATION_MAX_LENGTH })
  .withMessage(
    `Book location cannot be longer than ${app_config.BOOK_LOCATION_MAX_LENGTH} characters`
  );

// Default status validation
const book_status = body("book_status")
  .isString()
  .notEmpty()
  .withMessage("Book status is required")
  .isMongoId()
  .withMessage("Valid book status ID is required");

// Default collection validation
const collection = body("collection")
  .isString()
  .notEmpty()
  .withMessage("Book collection is required")
  .isMongoId()
  .withMessage("Valid book collection ID is required");

// ID validation rules
export const book_validation_rules_get_id = [id];

// Fetch book by classification validation rules
export const book_validation_rules_get_classification = [
  param("classification")
    .exists({ checkFalsy: true })
    .isString()
    .notEmpty()
    .withMessage("Book classification is required"),
];


// POST validation rules
export const book_validation_rules_post = [title, isbn, classification, summary, editorial, language, edition, age_restriction, sample, location, book_status, collection];

// PUT validation rules
export const book_validation_rules_update = [id, title, isbn, classification, summary, editorial, language, edition, age_restriction, sample, location, book_status, collection];
