import express from 'express';
import * as room_status_controller from './room_status.controller.js';
import * as room_status_validator from './room_status.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const room_status_router = express.Router();

room_status_router.get('/', room_status_controller.get_all_room_statuses);
room_status_router.get('/:id', room_status_validator.room_status_validation_rules_get_id, validate, room_status_controller.get_room_status_by_id);
room_status_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_ROOM_STATUS), room_status_validator.room_status_validation_rules_post, validate, room_status_controller.create_room_status);
room_status_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_ROOM_STATUS), room_status_validator.room_status_validation_rules_update, validate, room_status_controller.update_room_status);
room_status_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_ROOM_STATUS), room_status_validator.room_status_validation_rules_get_id, validate, room_status_controller.delete_room_status);

export {room_status_router};