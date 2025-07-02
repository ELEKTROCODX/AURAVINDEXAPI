import express from 'express';
import * as notification_controller from './notification.controller.js';
import * as notification_validator from './notification.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const notification_router = express.Router();

notification_router.get('/', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_NOTIFICATION), notification_controller.get_all_notifications);
notification_router.get('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_NOTIFICATION), notification_validator.notification_validation_rules_get_id, validate, notification_controller.get_notification_by_id);
notification_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_NOTIFICATION), notification_validator.notification_validation_rules_post, validate, notification_controller.create_notification);
notification_router.post('/all', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_NOTIFICATIONS_FOR_ALL_USERS), notification_validator.notification_validation_rules_post_all, validate, notification_controller.create_notifications_for_all_users);
notification_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_NOTIFICATION), notification_validator.notification_validation_rules_update, validate, notification_controller.update_notification);
notification_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_NOTIFICATION), notification_validator.notification_validation_rules_get_id, validate, notification_controller.delete_notification);
notification_router.put('/:id/mark_as_read', auth_middleware, validate_permission(app_config.PERMISSIONS.MARK_NOTIFICATION_AS_READ), notification_validator.notification_validation_rules_get_id, validate, notification_controller.mark_notification_as_read);
export {notification_router};