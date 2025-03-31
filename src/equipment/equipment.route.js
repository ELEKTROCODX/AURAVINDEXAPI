import express from 'express';
import * as equipment_controller from './equipment.controller.js';
import * as equipment_validator from './equipment.validator.js';
import validate from '../middleware/validation.middleware.js';
import { auth_middleware } from '../middleware/auth.middleware.js';
import { validate_permission } from '../middleware/permission.middleware.js';
import { app_config } from '../config/app.config.js';

const equipment_router = express.Router();

equipment_router.get('/', equipment_controller.get_all_equipments);
equipment_router.get('/:id', equipment_validator.equipment_validation_rules_get_id, validate, equipment_controller.get_equipment_by_id);
equipment_router.post('/', auth_middleware, validate_permission(app_config.PERMISSIONS.CREATE_EQUIPMENT), equipment_validator.equipment_validation_rules_post, validate, equipment_controller.create_equipment);
equipment_router.put('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.UPDATE_EQUIPMENT), equipment_validator.equipment_validation_rules_update, validate, equipment_controller.update_equipment);
equipment_router.delete('/:id', auth_middleware, validate_permission(app_config.PERMISSIONS.DELETE_EQUIPMENT), equipment_validator.equipment_validation_rules_get_id, validate, equipment_controller.delete_equipment);

export {equipment_router};