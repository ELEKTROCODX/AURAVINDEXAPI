import express from 'express';
import * as log_action_controller from './log_action.controller.js';
import * as log_action_validator from './log_action.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const log_action_router = express.Router();

log_action_router.get('/', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_LOG_ACTION), log_action_controller.get_all_log_actions);
log_action_router.get('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_LOG_ACTION), log_action_validator.log_action_validation_rules_get_id, validate, log_action_controller.get_log_action_by_id);
log_action_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_LOG_ACTION), log_action_validator.log_action_validation_rules_post, validate, log_action_controller.create_log_action);
log_action_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_LOG_ACTION), log_action_validator.log_action_validation_rules_update, validate, log_action_controller.update_log_action);
log_action_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_LOG_ACTION), log_action_validator.log_action_validation_rules_get_id, validate, log_action_controller.delete_log_action);

export {log_action_router};