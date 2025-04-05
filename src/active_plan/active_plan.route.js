import express from 'express';
import * as active_plan_controller from './active_plan.controller.js';
import * as active_plan_validator from './active_plan.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const active_plan_router = express.Router();

active_plan_router.get('/', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_ACTIVE_PLAN), active_plan_controller.get_all_active_plans);
active_plan_router.get('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_ACTIVE_PLAN), active_plan_validator.active_plan_validation_rules_get_id, validate, active_plan_controller.get_active_plan_by_id);
active_plan_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_ACTIVE_PLAN), active_plan_validator.active_plan_validation_rules_post, validate, active_plan_controller.create_active_plan);
active_plan_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_ACTIVE_PLAN), active_plan_validator.active_plan_validation_rules_update, validate, active_plan_controller.update_active_plan);
active_plan_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_ACTIVE_PLAN), active_plan_validator.active_plan_validation_rules_get_id, validate, active_plan_controller.delete_active_plan);
/* Request renewal route */
active_plan_router.put('/:id/renewal/', auth_middleware, validate_permission(app_config.PERMISSIONS.REQUEST_ACTIVE_PLAN_RENEWAL), active_plan_validator.active_plan_validation_rules_get_id, validate, active_plan_controller.request_active_plan_renewal);
/* Finish active plan route */
active_plan_router.put('/:id/finish/', auth_middleware, validate_permission(app_config.PERMISSIONS.FINISH_ACTIVE_PLAN), active_plan_validator.active_plan_validation_rules_get_id, validate, active_plan_controller.finish_active_plan);
//active_plan_router.put('/:id/cancel/', auth_middleware, validate_permission(app_config.PERMISSIONS.CANCEL_ACTIVE_PLAN), active_plan_validator.active_plan_validation_rules_get_id, active_plan_controller.return_book);
export {active_plan_router};