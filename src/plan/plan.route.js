import express from 'express';
import * as plan_controller from './plan.controller.js';
import * as plan_validator from './plan.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const plan_router = express.Router();

plan_router.get('/', auth_middleware, plan_controller.get_all_plans);
plan_router.get('/:id', auth_middleware, plan_validator.plan_validation_rules_get_id, validate, plan_controller.get_plan_by_id);
plan_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_PLAN), plan_validator.plan_validation_rules_post, validate, plan_controller.create_plan);
plan_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_PLAN), plan_validator.plan_validation_rules_update, validate, plan_controller.update_plan);
plan_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_PLAN), plan_validator.plan_validation_rules_get_id, validate, plan_controller.delete_plan);

export {plan_router};