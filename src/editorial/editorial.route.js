import express from 'express';
import * as editorial_controller from './editorial.controller.js';
import * as editorial_validator from './editorial.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const editorial_router = express.Router();

editorial_router.get('/', editorial_controller.get_all_editorials);
editorial_router.get('/:id', editorial_validator.editorial_validation_rules_get_id, validate, editorial_controller.get_editorial_by_id);
editorial_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_EDITORIAL), editorial_validator.editorial_validation_rules_post, validate, editorial_controller.create_editorial);
editorial_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_EDITORIAL), editorial_validator.editorial_validation_rules_update, validate, editorial_controller.update_editorial);
editorial_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_EDITORIAL), editorial_validator.editorial_validation_rules_get_id, validate, editorial_controller.delete_editorial);

export {editorial_router};