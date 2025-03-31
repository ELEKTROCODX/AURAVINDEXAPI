import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as alert_type_service from './alert_type.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
/**
 * Handles the creation of a new alert type.
 * @param {Object} req - The request object, containing the body with alert_code and message.
 * @param {Object} res - The response object.
 * @returns {void}
 */
export const create_alert_type = async (req, res) => {    
    const {alert_code, message} = req.body;
    try {
        await alert_type_service.create_new_alert_type(alert_code, message);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_ALERT_TYPE, alert_code);
        res.status(201).json({message: 'Alert type registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        res.status(500).json({message: 'Error creating alert type', error: error.message});
    }
}
/**
 * Retrieves all alert types, optionally filtering by a field and value.
 * @param {Object} req - The request object, containing query parameters.
 * @param {Object} res - The response object.
 * @returns {void}
 */
export const get_all_alert_types = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const alert_types = await alert_type_service.get_all_alert_types(page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_ALERT_TYPE, 'ALL_ALERT_TYPES');
            res.json(alert_types);
        } else {
            const alert_types = await alert_type_service.filter_alert_types(filter_field, filter_value, page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_ALERT_TYPE, 'FILTERED_ALERT_TYPES');
            res.json(alert_types);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching alert types', error: error.message});
    }
}
/**
 * Retrieves an alert type by its ID.
 * @param {Object} req - The request object, containing params with the ID.
 * @param {Object} res - The response object.
 * @returns {void}
 */
export const get_alert_type_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        
        const alert_type = await alert_type_service.get_alert_type_by_id(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_ALERT_TYPE, id);
        res.json(alert_type);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching alert type by ID', error: error.message});
    }
}
/**
 * Updates an alert type by its ID.
 * @param {Object} req - The request object, containing params with the ID and the body with updates.
 * @param {Object} res - The response object.
 * @returns {void}
 */
export const update_alert_type = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await alert_type_service.update_alert_type(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_ALERT_TYPE0, id);
        res.json({message: 'Alert type updated successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error updating alert type', error: error.message});
    }
}
/**
 * Deletes an alert type by its ID.
 * @param {Object} req - The request object, containing params with the ID.
 * @param {Object} res - The response object.
 * @returns {void}
 */
export const delete_alert_type = async (req, res) => {
    try {
        const id = req.params.id;
        await alert_type_service.delete_alert_type(id);        
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_ALERT_TYPE, id);
        res.json({message: 'Alert type deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error deleting alert type', error: error.message});
    }
}