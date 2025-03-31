import express from 'express';
import * as room_location_controller from './room_location.controller.js';
import * as room_location_validator from './room_location.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const room_location_router = express.Router();

room_location_router.get('/', room_location_controller.get_all_room_locations);
room_location_router.get('/:id', room_location_validator.room_location_validation_rules_get_id, validate, room_location_controller.get_room_location_by_id);
room_location_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_ROOM_LOCATION), room_location_validator.room_location_validation_rules_post, validate, room_location_controller.create_room_location);
room_location_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_ROOM_LOCATION), room_location_validator.room_location_validation_rules_update, validate, room_location_controller.update_room_location);
room_location_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_ROOM_LOCATION), room_location_validator.room_location_validation_rules_get_id, validate, room_location_controller.delete_room_location);

export {room_location_router};