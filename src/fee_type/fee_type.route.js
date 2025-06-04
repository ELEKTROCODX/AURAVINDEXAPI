import express from 'express';
import * as fee_type_controller from './fee_type.controller.js';
import * as fee_type_validator from './fee_type.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const fee_type_router = express.Router();

fee_type_router.get('/', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_FEE_TYPE), fee_type_controller.get_all_fee_types);
fee_type_router.get('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_FEE_TYPE), fee_type_validator.fee_type_validation_rules_get_id, validate, fee_type_controller.get_fee_type_by_id);
fee_type_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_FEE_TYPE), fee_type_validator.fee_type_validation_rules_post, validate, fee_type_controller.create_fee_type);
fee_type_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_FEE_TYPE), fee_type_validator.fee_type_validation_rules_update, validate, fee_type_controller.update_fee_type);
fee_type_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_FEE_TYPE), fee_type_validator.fee_type_validation_rules_get_id, validate, fee_type_controller.delete_fee_type);

export {fee_type_router};