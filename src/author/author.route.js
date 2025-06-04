import express from 'express';
import * as author_controller from './author.controller.js';
import * as author_validator from './author.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const author_router = express.Router();

author_router.get('/', author_controller.get_all_authors);
author_router.get('/:id', author_validator.author_validation_rules_get_id, validate, author_controller.get_author_by_id);
author_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_AUTHOR), author_validator.author_validation_rules_post, validate, author_controller.create_author);
author_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_AUTHOR), author_validator.author_validation_rules_update, validate, author_controller.update_author);
author_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_AUTHOR), author_validator.author_validation_rules_get_id, validate, author_controller.delete_author);

export {author_router};