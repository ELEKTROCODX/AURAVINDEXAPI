import express from 'express';
import * as audit_log_controller from './audit_log.controller.js';
import * as audit_log_validator from './audit_log.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const audit_log_router = express.Router();

audit_log_router.get('/', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_AUDIT_LOG), audit_log_controller.get_all_audit_logs);
audit_log_router.get('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_AUDIT_LOG), audit_log_validator.audit_log_validation_rules_get_id, validate, audit_log_controller.get_audit_log_by_id);
audit_log_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_AUDIT_LOG), audit_log_validator.audit_log_validation_rules_post, validate, audit_log_controller.create_audit_log);

export {audit_log_router};