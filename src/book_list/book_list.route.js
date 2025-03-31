import express from 'express';
import * as book_list_controller from './book_list.controller.js';
import * as book_list_validator from './book_list.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const book_list_router = express.Router();

book_list_router.get('/', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_BOOK_LIST), book_list_controller.get_all_book_lists);
book_list_router.get('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.READ_BOOK_LIST), book_list_validator.book_list_validation_rules_get_id, validate, book_list_controller.get_book_list_by_id);
book_list_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_BOOK_LIST), book_list_validator.book_list_validation_rules_post, validate, book_list_controller.create_book_list);
book_list_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_BOOK_LIST), book_list_validator.book_list_validation_rules_update, validate, book_list_controller.update_book_list);
book_list_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_BOOK_LIST), book_list_validator.book_list_validation_rules_get_id, validate, book_list_controller.delete_book_list);

//book_list_router.get();
book_list_router.post('/:book_list_id/book/:book_id', auth_middleware, validate_permission(app_config.PERMISSIONS.ADD_BOOK_TO_LIST), book_list_validator.book_validation_rules, validate, book_list_controller.add_book_to_book_list);
book_list_router.delete('/:book_list_id/book/:book_id', auth_middleware, validate_permission(app_config.PERMISSIONS.REMOVE_BOOK_FROM_LIST), book_list_validator.book_validation_rules, validate, book_list_controller.remove_book_from_book_list);

export {book_list_router};
