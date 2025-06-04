import express from 'express';
import * as loan_status_controller from './loan_status.controller.js';
import * as loan_status_validator from './loan_status.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const loan_status_router = express.Router();

loan_status_router.get('/', loan_status_controller.get_all_loan_statuses);
loan_status_router.get('/:id', loan_status_validator.loan_status_validation_rules_get_id, validate, loan_status_controller.get_loan_status_by_id);
loan_status_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_BOOK_STATUS), loan_status_validator.loan_status_validation_rules_post, validate, loan_status_controller.create_loan_status);
loan_status_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_BOOK_STATUS), loan_status_validator.loan_status_validation_rules_update, validate, loan_status_controller.update_loan_status);
loan_status_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_BOOK_STATUS), loan_status_validator.loan_status_validation_rules_get_id, validate, loan_status_controller.delete_loan_status);

export {loan_status_router};