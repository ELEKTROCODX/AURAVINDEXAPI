import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as log_action_service from './log_action.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
/**
 * Creates a new log action from the provided request body.
 * @param {Object} req - The request object containing the log action data.
 * @param {Object} res - The response object to send the result back to the client.
 * @throws {ObjectAlreadyExists} If the log action already exists.
 */
export const create_log_action = async (req, res) => {
    const {action_code} = req.body;
    try {
        await log_action_service.create_new_log_action(action_code);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_LOG_ACTION, action_code);
        res.status(201).json({message: 'Log action registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        res.status(500).json({message: 'Error creating log action', error: error.message});
    }
}
/**
 * Retrieves log actions with optional filtering and pagination.
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} res - The response object to send the result back to the client.
 * @throws {ObjectInvalidQueryFilters} If the query parameters are invalid.
 */
export const get_all_log_actions = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const log_actions = await log_action_service.get_all_log_actions(page, limit);
            res.json(log_actions);
        } else {
            const log_actions = await log_action_service.filter_log_actions(filter_field, filter_value, page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_LOG_ACTION, 'FILTERED_LOG_ACTIONS');
            res.json(log_actions);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching log actions', error: error.message});
    }
}
/**
 * Retrieves a log action by its ID.
 * @param {Object} req - The request object containing the ID as a parameter.
 * @param {Object} res - The response object to send the result back to the client.
 * @throws {ObjectNotFound} If the log action is not found.
 */
export const get_log_action_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const log_action = await log_action_service.get_log_action_by_id(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_LOG_ACTION, id);
        res.json(log_action);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching log action by ID', error: error.message});
    }
}
/**
 * Updates a log action with the specified ID and data.
 * @param {Object} req - The request object containing the ID as a parameter and the update data in the body.
 * @param {Object} res - The response object to send the result back to the client.
 * @throws {ObjectMissingParameters} If the ID is missing.
 * @throws {ObjectAlreadyExists} If a log action with the updated action code already exists.
 * @throws {ObjectNotFound} If the log action is not found.
 */
export const update_log_action = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        await log_action_service.update_log_action(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_LOG_ACTION, id);
        res.json({message: 'Log action updated successfully'});
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
        res.status(500).json({message: 'Error updating log action', error: error.message});
    }
}
/**
 * Deletes a log action by its ID.
 * @param {Object} req - The request object containing the ID as a parameter.
 * @param {Object} res - The response object to send the result back to the client.
 * @throws {ObjectMissingParameters} If the ID is missing.
 * @throws {ObjectNotFound} If the log action is not found.
 */
export const delete_log_action = async (req, res) => {
    try {
        const id = req.params.id;
        await log_action_service.delete_log_action(id);        
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_LOG_ACTION, id);
        res.json({message: 'Log action deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error deleting log action', error: error.message});
    }
}