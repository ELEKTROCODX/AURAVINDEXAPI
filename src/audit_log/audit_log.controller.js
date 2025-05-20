import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as audit_log_service from './audit_log.service.js';
/**
 * Creates a new audit log entry by calling the service.
 * 
 * @param {Request} req - The request object containing user, action, and object data.
 * @param {Response} res - The response object to send the status.
 * @returns {void}
 */
export const create_audit_log = async (req, res) => {
    const {user, action, affected_object} = req.body;
    try {
        await audit_log_service.create_new_audit_log(user, action, affected_object);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_AUDIT_LOG, `${user} - ${action} - ${affected_object}`);
        res.status(201).json({message: 'Audit log registered successfully'});
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        res.status(500).json({message: 'Error creating audit log', error: error.message});
    }
}
/**
 * Retrieves all audit logs, optionally filtered by the query parameters.
 * 
 * @param {Request} req - The request object containing query parameters.
 * @param {Response} res - The response object to send the results.
 * @returns {void}
 */
export const get_all_audit_logs = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const audit_logs = await audit_log_service.get_all_audit_logs(page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_AUDIT_LOG, 'AUDIT_LOGS');
            res.json(audit_logs);
        } else {
            const audit_logs = await audit_log_service.filter_audit_logs(filter_field, filter_value, page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_AUDIT_LOG, 'FILTERED_AUDIT_LOGS');
            res.json(audit_logs);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching audit logs', error: error.message});
    }
}
/**
 * Retrieves a specific audit log by its ID.
 * 
 * @param {Request} req - The request object containing the ID parameter.
 * @param {Response} res - The response object to send the requested audit log.
 * @returns {void}
 */
export const get_audit_log_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const audit_log = await audit_log_service.get_audit_log_by_id(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_AUDIT_LOG, id);
        res.json(audit_log);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching audit log by ID', error: error.message});
    }
}
