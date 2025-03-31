import express from 'express';
import * as fee_status_controller from './fee_status.controller.js';
import * as fee_status_validator from './fee_status.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const fee_status_router = express.Router();

fee_status_router.get('/', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_FEE_STATUS), fee_status_controller.get_all_fee_statuses);
fee_status_router.get('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_FEE_STATUS), fee_status_validator.fee_status_validation_rules_get_id, validate, fee_status_controller.get_fee_status_by_id);
fee_status_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_FEE_STATUS), fee_status_validator.fee_status_validation_rules_post, validate, fee_status_controller.create_fee_status);
fee_status_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_FEE_STATUS), fee_status_validator.fee_status_validation_rules_update, validate, fee_status_controller.update_fee_status);
fee_status_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_FEE_STATUS), fee_status_validator.fee_status_validation_rules_get_id, validate, fee_status_controller.delete_fee_status);

export {fee_status_router};