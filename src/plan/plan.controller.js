import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as plan_service from './plan.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
import { apiLogger } from '../config/util.js';
/**
 * Controller to handle the creation of a new plan.
 *
 * @param {Object} req - The HTTP request object containing name and price in the body.
 * @param {Object} res - The HTTP response object used to send the response.
 * @returns {void}
 */
export const create_plan = async (req, res) => {
    const {name, fixed_price, monthly_price, max_simultaneous_loans, max_return_days, max_renewals_per_loan} = req.body;
    try {
        await plan_service.create_new_plan(name, fixed_price, monthly_price, max_simultaneous_loans, max_return_days, max_renewals_per_loan);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_PLAN, name);
        res.status(201).json({message: 'Plan registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        apiLogger.error('Error creating plan: ', error.message);
        res.status(500).json({message: 'Error creating plan', error: error.message});
    }
}
/**
 * Controller to retrieve all plans, with optional filtering and pagination.
 *
 * @param {Object} req - The HTTP request object containing filter_field, filter_value, page, and limit in the query.
 * @param {Object} res - The HTTP response object used to send the response.
 * @returns {void}
 */
export const get_all_plans = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const plans = await plan_service.get_all_plans(page, limit);
            res.json(plans);
        } else {
            const plans = await plan_service.filter_plans(filter_field, filter_value, page, limit);
            res.json(plans);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching plans: ', error.message);
        res.status(500).json({message: 'Error fetching plans', error: error.message});
    }
}
/**
 * Controller to retrieve a specific plan by its ID.
 *
 * @param {Object} req - The HTTP request object containing the plan ID in the route parameters.
 * @param {Object} res - The HTTP response object used to send the response.
 * @returns {void}
 */
export const get_plan_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const plan = await plan_service.get_plan_by_id(id);
        res.json(plan);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching plan by ID: ', error.message);
        res.status(500).json({message: 'Error fetching plan by ID', error: error.message});
    }
}
/**
 * Controller to update an existing plan by its ID.
 *
 * @param {Object} req - The HTTP request object containing the plan ID in the route parameters and update fields in the body.
 * @param {Object} res - The HTTP response object used to send the response.
 * @returns {void}
 */
export const update_plan = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await plan_service.update_plan(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_PLAN, id);
        res.json({message: 'Plan updated successfully'});
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
        apiLogger.error('Error updating plan: ', error.message);
        res.status(500).json({message: 'Error updating plan', error: error.message});
    }
}
/**
 * Controller to delete a plan by its ID.
 *
 * @param {Object} req - The HTTP request object containing the plan ID in the route parameters.
 * @param {Object} res - The HTTP response object used to send the response.
 * @returns {void}
 */
export const delete_plan = async (req, res) => {
    try {
        const id = req.params.id;
        await plan_service.delete_plan(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_PLAN, id);
        res.json({message: 'Plan deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error deleting plan: ', error.message);
        res.status(500).json({message: 'Error deleting plan', error: error.message});
    }
}