import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as alert_service from './alert.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
/**
 * Controller to handle the creation of a new alert.
 *
 * @param {Object} req - The HTTP request object containing alert_type, sender, and receiver in the body.
 * @param {Object} res - The HTTP response object used to send the response.
 * @returns {void}
 */
export const create_alert = async (req, res) => {
    const {alert_type, sender, receiver} = req.body;
    try {
        await alert_service.create_new_alert(alert_type, sender, receiver);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_ALERT, alert_type);
        res.status(201).json({message: 'Alert registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        res.status(500).json({message: 'Error creating alert', error: error.message});
    }
}
/**
 * Controller to retrieve all alerts, with optional filtering and pagination.
 *
 * @param {Object} req - The HTTP request object containing filter_field, filter_value, page, and limit in the query.
 * @param {Object} res - The HTTP response object used to send the response.
 * @returns {void}
 */
export const get_all_alerts = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const alerts = await alert_service.get_all_alerts(page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_ALERT, 'ALL_ALERTS');
            res.json(alerts);
        } else {
            const alerts = await alert_service.filter_alerts(filter_field, filter_value, page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_ALERT, 'FILTERED_ALERTS');
            res.json(alerts);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching alerts', error: error.message});
    }
}
/**
 * Controller to retrieve a specific alert by its ID.
 *
 * @param {Object} req - The HTTP request object containing the alert ID in the route parameters.
 * @param {Object} res - The HTTP response object used to send the response.
 * @returns {void}
 */
export const get_alert_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const alert = await alert_service.get_alert_by_id(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_ALERT, id);
        res.json(alert);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching alert by ID', error: error.message});
    }
}
/**
 * Controller to update an existing alert by its ID.
 *
 * @param {Object} req - The HTTP request object containing the alert ID in the route parameters and update fields in the body.
 * @param {Object} res - The HTTP response object used to send the response.
 * @returns {void}
 */
export const update_alert = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await alert_service.update_alert(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_ALERT, id);
        res.json({message: 'Alert updated successfully'});
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
        res.status(500).json({message: 'Error updating alert', error: error.message});
    }
}
/**
 * Controller to delete an alert by its ID.
 *
 * @param {Object} req - The HTTP request object containing the alert ID in the route parameters.
 * @param {Object} res - The HTTP response object used to send the response.
 * @returns {void}
 */
export const delete_alert = async (req, res) => {
    try {
        const id = req.params.id;
        await alert_service.delete_alert(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_ALERT, id);
        res.json({message: 'Alert deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error deleting alert', error: error.message});
    }
}