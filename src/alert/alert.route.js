import express from 'express';;
import * as alert_controller from './alert.controller.js';
import * as alert_validator from './alert.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const alert_router = express.Router();

alert_router.get('/', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_ALERT), alert_controller.get_all_alerts);
alert_router.get('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_ALERT), alert_validator.alert_validation_rules_get_id, validate, alert_controller.get_alert_by_id);
alert_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_ALERT), alert_validator.alert_validation_rules_post, validate, alert_controller.create_alert);
alert_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_ALERT), alert_validator.alert_validation_rules_update, validate, alert_controller.update_alert);
alert_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_ALERT), alert_validator.alert_validation_rules_get_id, validate, alert_controller.delete_alert);

export {alert_router};