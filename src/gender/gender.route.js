import express from 'express';
import * as gender_controller from './gender.controller.js';
import * as gender_validator from './gender.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const gender_router = express.Router();

gender_router.get('/', gender_controller.get_all_genders);
gender_router.get('/:id', gender_validator.gender_validation_rules_get_id, validate, gender_controller.get_gender_by_id);
gender_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_GENDER), gender_validator.gender_validation_rules_post, validate, gender_controller.create_gender);
gender_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_GENDER), gender_validator.gender_validation_rules_update, validate, gender_controller.update_gender);
gender_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_GENDER), gender_validator.gender_validation_rules_get_id, validate, gender_controller.delete_gender);

export {gender_router};