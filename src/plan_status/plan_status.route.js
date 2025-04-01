import express from 'express';
import * as plan_status_controller from './plan_status.controller.js';
import * as plan_status_validator from './plan_status.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const plan_status_router = express.Router();

plan_status_router.get('/', plan_status_controller.get_all_plan_statuses);
plan_status_router.get('/:id', plan_status_validator.plan_status_validation_rules_get_id, validate, plan_status_controller.get_plan_status_by_id);
plan_status_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_BOOK_STATUS), plan_status_validator.plan_status_validation_rules_post, validate, plan_status_controller.create_plan_status);
plan_status_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_BOOK_STATUS), plan_status_validator.plan_status_validation_rules_update, validate, plan_status_controller.update_plan_status);
plan_status_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_BOOK_STATUS), plan_status_validator.plan_status_validation_rules_get_id, validate, plan_status_controller.delete_plan_status);

export {plan_status_router};