import express from 'express';
import * as book_status_controller from './book_status.controller.js';
import * as book_status_validator from './book_status.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const book_status_router = express.Router();

book_status_router.get('/', book_status_controller.get_all_book_statuses);
book_status_router.get('/:id', book_status_validator.book_status_validation_rules_get_id, validate, book_status_controller.get_book_status_by_id);
book_status_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_BOOK_STATUS), book_status_validator.book_status_validation_rules_post, validate, book_status_controller.create_book_status);
book_status_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_BOOK_STATUS), book_status_validator.book_status_validation_rules_update, validate, book_status_controller.update_book_status);
book_status_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_BOOK_STATUS), book_status_validator.book_status_validation_rules_get_id, validate, book_status_controller.delete_book_status);

export {book_status_router};