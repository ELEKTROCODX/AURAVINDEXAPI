import express from 'express';
import * as loan_controller from './loan.controller.js';
import * as loan_validator from './loan.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const loan_router = express.Router();

loan_router.get('/', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_LOAN), loan_controller.get_all_loans);
loan_router.get('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_LOAN), loan_validator.loan_validation_rules_get_id, validate, loan_controller.get_loan_by_id);
loan_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_LOAN), loan_validator.loan_validation_rules_post, validate, loan_controller.create_loan);
loan_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_LOAN), loan_validator.loan_validation_rules_update, validate, loan_controller.update_loan);
loan_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_LOAN), loan_validator.loan_validation_rules_get_id, validate, loan_controller.delete_loan);
/* Request renewal route */
loan_router.put('/:id/renewal/', auth_middleware, validate_permission(app_config.PERMISSIONS.REQUEST_LOAN_RENEWAL), loan_validator.loan_validation_rules_get_id, validate, loan_controller.request_loan_renewal);
/* Finish loan route */
loan_router.put('/:id/finish/', auth_middleware, validate_permission(app_config.PERMISSIONS.FINISH_LOAN), loan_validator.loan_validation_rules_get_id, validate, loan_controller.finish_loan);
//loan_router.put('/:id/return/', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_LOAN), loan_validator.loan_validation_rules_get_id, loan_controller.return_book);
export {loan_router};