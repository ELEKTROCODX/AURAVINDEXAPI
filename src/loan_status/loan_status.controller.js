import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as loan_status_service from './loan_status.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
/**
 * Creates a new loan status by calling the loan status service.
 * 
 * @param {Object} req The request object containing the loan status in the body.
 * @param {Object} res The response object for sending back the result.
 * @returns {void}
 */
export const create_loan_status = async (req, res) => {
    const {loan_status} = req.body;
    try {
        await loan_status_service.create_new_loan_status(loan_status);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_LOAN_STATUS, loan_status);
        res.status(201).json({message: 'Loan status registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        res.status(500).json({message: 'Error creating loan status', error: error.message});
    }
}

/**
 * Retrieves all loan statuses, optionally filtered by query parameters.
 * 
 * @param {Object} req The request object containing query parameters for filtering and pagination.
 * @param {Object} res The response object for sending back the list of loan statuses.
 * @returns {void}
 */
export const get_all_loan_statuses = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const loan_statuses = await loan_status_service.get_all_loan_statuses(page, limit);
            res.json(loan_statuses);
        } else {
            const loan_statuses = await loan_status_service.filter_loan_statuses(filter_field, filter_value, page, limit);
            res.json(loan_statuses);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching loan statuses', error: error.message});
    }
}
/**
 * Retrieves a loan status by its ID.
 * 
 * @param {Object} req The request object containing the loan status ID as a URL parameter.
 * @param {Object} res The response object for sending back the result.
 * @returns {void}
 */
export const get_loan_status_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        
        const loan_status = await loan_status_service.get_loan_status_by_id(id);
        res.json(loan_status);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching loan status by ID', error: error.message});
    }
}
/**
 * Updates a loan status by its ID.
 * 
 * @param {Object} req The request object containing the loan status ID as a URL parameter and updates in the body.
 * @param {Object} res The response object for sending back the result.
 * @returns {void}
 */
export const update_loan_status = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await loan_status_service.update_loan_status(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_LOAN_STATUS, id);
        res.json({message: 'Loan status updated successfully'});
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
        res.status(500).json({message: 'Error updating loan status', error: error.message});
    }
}
/**
 * Deletes a loan status by its ID.
 * 
 * @param {Object} req The request object containing the loan status ID as a URL parameter.
 * @param {Object} res The response object for sending back the result.
 * @returns {void}
 */
export const delete_loan_status = async (req, res) => {
    try {
        const id = req.params.id;
        await loan_status_service.delete_loan_status(id);        
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_LOAN_STATUS, id);
        res.json({message: 'Loan status deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error deleting loan status', error: error.message});
    }
}