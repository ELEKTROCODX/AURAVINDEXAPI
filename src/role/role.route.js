import express from 'express';
import * as role_controller from './role.controller.js';
import * as role_validator from './role.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const role_router = express.Router();

role_router.get('/', role_controller.get_all_roles);
role_router.get('/:id', role_validator.role_validation_rules_get_id, validate, role_controller.get_role_by_id);
role_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_ROLE), role_validator.role_validation_rules_post, validate, role_controller.create_role);
role_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_ROLE), role_validator.role_validation_rules_update, validate, role_controller.update_role);
role_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_ROLE), role_validator.role_validation_rules_get_id, validate, role_controller.delete_role);

//role_router.get();
role_router.post('/:id/permission/', auth_middleware, validate_permission(app_config.PERMISSIONS.ADD_PERMISSION_TO_ROLE), role_validator.permission_validation_rules, validate, role_controller.add_permission_to_role);
role_router.delete('/:id/permission/', auth_middleware, validate_permission(app_config.PERMISSIONS.REMOVE_PERMISSION_FROM_ROLE), role_validator.permission_validation_rules, validate, role_controller.remove_permission_from_role);


export {role_router};
