import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as plan_status_service from './plan_status.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
/**
 * Creates a new plan status by calling the plan status service.
 * 
 * @param {Object} req The request object containing the plan status in the body.
 * @param {Object} res The response object for sending back the result.
 * @returns {void}
 */
export const create_plan_status = async (req, res) => {
    const {plan_status} = req.body;
    try {
        await plan_status_service.create_new_plan_status(plan_status);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_PLAN_STATUS, plan_status);
        res.status(201).json({message: 'Plan status registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        res.status(500).json({message: 'Error creating plan status', error: error.message});
    }
}

/**
 * Retrieves all plan statuses, optionally filtered by query parameters.
 * 
 * @param {Object} req The request object containing query parameters for filtering and pagination.
 * @param {Object} res The response object for sending back the list of plan statuses.
 * @returns {void}
 */
export const get_all_plan_statuses = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const plan_statuses = await plan_status_service.get_all_plan_statuses(page, limit);
            res.json(plan_statuses);
        } else {
            const plan_statuses = await plan_status_service.filter_plan_statuses(filter_field, filter_value, page, limit);
            res.json(plan_statuses);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching plan statuses', error: error.message});
    }
}
/**
 * Retrieves a plan status by its ID.
 * 
 * @param {Object} req The request object containing the plan status ID as a URL parameter.
 * @param {Object} res The response object for sending back the result.
 * @returns {void}
 */
export const get_plan_status_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        
        const plan_status = await plan_status_service.get_plan_status_by_id(id);
        res.json(plan_status);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching plan status by ID', error: error.message});
    }
}
/**
 * Updates a plan status by its ID.
 * 
 * @param {Object} req The request object containing the plan status ID as a URL parameter and updates in the body.
 * @param {Object} res The response object for sending back the result.
 * @returns {void}
 */
export const update_plan_status = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await plan_status_service.update_plan_status(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_PLAN_STATUS, id);
        res.json({message: 'Plan status updated successfully'});
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
        res.status(500).json({message: 'Error updating plan status', error: error.message});
    }
}
/**
 * Deletes a plan status by its ID.
 * 
 * @param {Object} req The request object containing the plan status ID as a URL parameter.
 * @param {Object} res The response object for sending back the result.
 * @returns {void}
 */
export const delete_plan_status = async (req, res) => {
    try {
        const id = req.params.id;
        await plan_status_service.delete_plan_status(id);        
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_PLAN_STATUS, id);
        res.json({message: 'Plan status deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error deleting plan status', error: error.message});
    }
}