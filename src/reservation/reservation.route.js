import express from 'express';
import * as reservation_controller from './reservation.controller.js';
import * as reservation_validator from './reservation.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const reservation_router = express.Router();

reservation_router.get('/', reservation_controller.get_all_reservations);
reservation_router.get('/:id', reservation_validator.reservation_validation_rules_get_id, validate, reservation_controller.get_reservation_by_id);
reservation_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_RESERVATION), reservation_validator.reservation_validation_rules_post, validate, reservation_controller.create_reservation);
reservation_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_RESERVATION), reservation_validator.reservation_validation_rules_update, validate, reservation_controller.update_reservation);
reservation_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_RESERVATION), reservation_validator.reservation_validation_rules_get_id, validate, reservation_controller.delete_reservation);

export {reservation_router};