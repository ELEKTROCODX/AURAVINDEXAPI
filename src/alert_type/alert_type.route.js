import express from 'express';
import * as alert_type_controller from './alert_type.controller.js';
import * as alert_type_validator from './alert_type.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const alert_type_router = express.Router();

alert_type_router.get('/', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_ALERT_TYPE), alert_type_controller.get_all_alert_types);
alert_type_router.get('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_ALERT_TYPE), alert_type_validator.alert_type_validation_rules_get_id, validate, alert_type_controller.get_alert_type_by_id);
alert_type_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_ALERT_TYPE), alert_type_validator.alert_type_validation_rules_post, validate, alert_type_controller.create_alert_type);
alert_type_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_ALERT_TYPE), alert_type_validator.alert_type_validation_rules_update, validate, alert_type_controller.update_alert_type);
alert_type_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_ALERT_TYPE), alert_type_validator.alert_type_validation_rules_get_id, validate, alert_type_controller.delete_alert_type);

export {alert_type_router};