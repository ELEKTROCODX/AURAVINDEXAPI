import express from 'express';
import * as recent_book_controller from './recent_book.controller.js';
import * as recent_book_validator from './recent_book.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const recent_book_router = express.Router();

recent_book_router.get('/', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_RECENT_BOOK), recent_book_controller.get_all_recent_books);
recent_book_router.get('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_RECENT_BOOK), recent_book_validator.recent_book_validation_rules_get_id, validate, recent_book_controller.get_recent_book_by_id);
recent_book_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_RECENT_BOOK), recent_book_validator.recent_book_validation_rules_post, validate, recent_book_controller.create_recent_book);

export {recent_book_router};