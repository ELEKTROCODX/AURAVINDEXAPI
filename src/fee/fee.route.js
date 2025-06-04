import express from 'express';
import * as fee_controller from './fee.controller.js';
import * as fee_validator from './fee.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const fee_router = express.Router();

fee_router.get('/', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_FEE), fee_controller.get_all_fees);
fee_router.get('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_FEE), fee_validator.fee_validation_rules_get_id, validate, fee_controller.get_fee_by_id);
fee_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_FEE), fee_validator.fee_validation_rules_post, validate, fee_controller.create_fee);
fee_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_FEE), fee_validator.fee_validation_rules_update, validate, fee_controller.update_fee);
fee_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_FEE), fee_validator.fee_validation_rules_get_id, validate, fee_controller.delete_fee);

export {fee_router};