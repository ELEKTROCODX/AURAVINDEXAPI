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

// Default plan validation
const plan = body("plan")
  .isString()
  .notEmpty()
  .withMessage("Plan is required")
  .isMongoId()
  .withMessage("Valid plan ID is required");

// Default plan status validation
const plan_status = body("plan_status")
  .optional()
  .isString()
  .isMongoId()
  .withMessage("Valid plan status ID is required");

// Default ending date validation
const ending_date = body("ending_date")
  .optional()
  .isISO8601() // ISO 8601 (yyyy-MM-dd)
  .withMessage("Invalid ending date format, use yyyy-MM-dd");

// Default finished date validation
const finished_date = body("finished_date")
  .optional()
  .custom((value) => {
    if (!is_valid_date_time_format(value)) {
      throw new Error("Invalid finished date format, use yyyy-MM-dd HH:MM");
    }
    return true;
  });

// ID validation rules
export const active_plan_validation_rules_get_id = [id];

// POST validation rules
export const active_plan_validation_rules_post = [user, plan, plan_status, ending_date, finished_date];

// PUT validation rules
export const active_plan_validation_rules_update = [id, user, plan, plan_status, ending_date, finished_date];
