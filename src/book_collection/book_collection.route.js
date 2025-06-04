import express from 'express';
import * as book_collection_controller from './book_collection.controller.js';
import * as book_collection_validator from './book_collection.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const book_collection_router = express.Router();

book_collection_router.get('/', book_collection_controller.get_all_book_collections);
book_collection_router.get('/:id', book_collection_validator.book_collection_validation_rules_get_id, validate, book_collection_controller.get_book_collection_by_id);
book_collection_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_BOOK_COLLECTION), book_collection_validator.book_collection_validation_rules_post, validate, book_collection_controller.create_book_collection);
book_collection_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_BOOK_COLLECTION), book_collection_validator.book_collection_validation_rules_update, validate, book_collection_controller.update_book_collection);
book_collection_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_BOOK_COLLECTION), book_collection_validator.book_collection_validation_rules_get_id, validate, book_collection_controller.delete_book_collection);

export {book_collection_router};