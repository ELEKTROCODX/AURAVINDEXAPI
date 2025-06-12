import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectNotAvailable, ObjectInvalidQueryFilters, ActivePlanAlreadyFinished, ActivePlanAlreadyCancelled } from '../config/errors.js';
import * as active_plan_service from './active_plan.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
import { apiLogger } from '../config/util.js';
/**
 * Creates a new active plan for a user and a book.
 * 
 * @param {Object} req - The request object containing the active plan details.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {void} Sends a response with a status code and message indicating success or failure.
 * @throws {ObjectAlreadyExists} If an active plan already exists for the given user.
 * @throws {ObjectNotAvailable} If the plan is not available.
 * @throws {ObjectNotFound} If some data is not found.
 */
export const create_active_plan = async (req, res) => {
    const {user, plan, plan_status, ending_date, finished_date} = req.body;
    try {
        await active_plan_service.create_new_active_plan(user, plan, plan_status, ending_date, finished_date);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_ACTIVE_PLAN, `${user} - ${plan}`);
        res.status(201).json({message: 'Active plan registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotAvailable) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error creating active plan: ', error.message);
        res.status(500).json({message: 'Error creating active plan', error: error.message});
    }
}
/**
 * Retrieves all active plans with pagination and optional filtering.
 * 
 * @param {Object} req - The request object containing query parameters for filtering and pagination.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {void} Sends a response with the list of active plans or an error message.
 * @throws {ObjectInvalidQueryFilters} If invalid filters are provided in the query parameters.
 */
export const get_all_active_plans = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT, sort = "asc", sort_by = "createdAt", is_active = false } = req.query;
        if(!filter_field || !filter_value) {
            const active_plans = await active_plan_service.get_all_active_plans(page, limit, sort, sort_by, is_active);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_ACTIVE_PLAN, 'ALL_ACTIVE_PLANS');
            res.json(active_plans);
        } else {
            const active_plans = await active_plan_service.filter_active_plans(filter_field, filter_value, page, limit, sort, sort_by, is_active);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_ACTIVE_PLAN, 'FILTERED_ACTIVE_PLANS');
            res.json(active_plans);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching active plans: ', error.message);
        res.status(500).json({message: 'Error fetching active plans', error: error.message});
    }
}
/**
 * Retrieves a active plan by its ID.
 * 
 * @param {Object} req - The request object containing the active plan ID in the URL parameters.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {void} Sends a response with the active plan object or an error message.
 * @throws {ObjectNotFound} If the active plan with the specified ID does not exist.
 * @throws {ObjectMissingParameters} If the active plan ID is missing in the request.
 */
export const get_active_plan_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const active_plan = await active_plan_service.get_active_plan_by_id(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_ACTIVE_PLAN, id);
        res.json(active_plan);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching active plan by ID: ', error.message);
        res.status(500).json({message: 'Error fetching active plan by ID', error: error.message});
    }
}
/**
 * Updates an existing active plan with new information.
 * 
 * @param {Object} req - The request object containing the active plan ID in the URL and the updates in the body.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {void} Sends a response indicating that the active plan was updated successfully.
 * @throws {ObjectMissingParameters} If the active plan ID or required parameters are missing.
 * @throws {ObjectAlreadyExists} If a conflicting active plan already exists.
 * @throws {ObjectNotAvailable} If the plan is not available.
 * @throws {ObjectNotFound} If the active plan, user, or plan is not found.
 */
export const update_active_plan = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await active_plan_service.update_active_plan(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_ACTIVE_PLAN, id);
        res.json({message: 'Active plan updated successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotAvailable) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error updating active plan: ', error.message);
        res.status(500).json({message: 'Error updating active plan', error: error.message});
    }
}
/**
 * Deletes a active plan by its ID.
 * 
 * @param {Object} req - The request object containing the active plan ID in the URL parameters.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {void} Sends a response indicating that the active plan was deleted successfully.
 * @throws {ObjectMissingParameters} If the active plan ID is missing.
 * @throws {ObjectNotFound} If the active plan with the specified ID does not exist.
 */
export const delete_active_plan = async (req, res) => {
    try {
        const id = req.params.id;
        await active_plan_service.delete_active_plan(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_ACTIVE_PLAN, id);
        res.json({message: 'Active plan deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error deleting active plan: ', error.message);
        res.status(500).json({message: 'Error deleting active plan', error: error.message});
    }
}
/**
 * Requests a renewal for an existing active plan.
 * 
 * @param {Object} req - The request object containing the active plan ID in the URL parameters.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {void} Sends a response indicating that the active plan was renewed successfully.
 * @throws {ActivePlanAlreadyFinished} If the active plan has already been finished.
 * @throws {ObjectNotFound} If the active plan with the specified ID does not exist.
 * @throws {ObjectMissingParameters} If the active plan ID is missing.
 * @throws {ObjectNotAvailable} If the book is not available for renewal.
 */
export const request_active_plan_renewal = async (req, res) => {
    try {
        const id = req.params.id;
        await active_plan_service.request_active_plan_renewal(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.REQUEST_ACTIVE_PLAN_RENEWAL, id);
        res.json({mesage: 'Active plan renewed successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotAvailable) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ActivePlanAlreadyFinished) {
            return res.status(409).json({message: error.message});
        }
        apiLogger.error('Error requesting active plan renewal: ', error.message);
        res.status(500).json({message: 'Error reqesting active plan renewal', error: error.message});
    }
}
/**
 * Completes an active plan by updating its status to "FINISHED".
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the active plan to finish.
 * @param {Object} res - The HTTP response object.
 * @throws {ObjectMissingParameters} If the active plan ID is missing.
 * @throws {ObjectNotFound} If the active plan is not found.
 * @throws {Active planAlreadyFinished} If the active plan has already been finished.
 * @throws {ObjectAlreadyExists | ObjectNotAvailable} If other specific active plan-related issues occur.
 * @returns {void} Sends a JSON response indicating the active plan completion result.
 */
export const finish_active_plan = async (req, res) => {
    try {
        const id = req.params.id;
        await active_plan_service.finish_active_plan(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.FINISH_ACTIVE_PLAN, id);
        res.json({message: 'Active plan finished successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotAvailable) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ActivePlanAlreadyFinished) {
            return res.status(409).json({message: error.message});
        }
        apiLogger.error('Error finishing active plan: ', error.message);
        res.status(500).json({message: 'Error finishing active plan', error: error.message});
    }
}
/**
 * Completes an plan by updating its status and the associated book's status to "AVAILABLE".
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the active plan to finish.
 * @param {Object} res - The HTTP response object.
 * @throws {ObjectMissingParameters} If the active plan ID is missing.
 * @throws {ObjectNotFound} If the active plan or book is not found.
 * @throws {ActivePlanAlreadyCancelled} If the active plan has already been cancelled.
 * @throws {ObjectAlreadyExists | ObjectNotAvailable} If other specific active plan-related issues occur.
 * @returns {void} Sends a JSON response indicating the active plan completion result.
 */
export const cancel_active_plan = async (req, res) => {
    try {
        const id = req.params.id;
        await active_plan_service.cancel_active_plan(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CANCEL_ACTIVE_PLAN, id);
        res.json({message: 'Active plan cancelled successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotAvailable) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ActivePlanAlreadyCancelled) {
            return res.status(409).json({message: error.message});
        }
        apiLogger.error('Error cancelling active plan: ', error.message);
        res.status(500).json({message: 'Error cancelling active plan', error: error.message});
    }
}