import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as fee_service from './fee.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
import { apiLogger } from '../config/util.js';
/**
 * Creates a new fee and sends a response with the result.
 * 
 * @param {Object} req - The request object, containing fee data in the body.
 * @param {Object} res - The response object to send the result.
 * @returns {void}
 * @throws {ObjectNotFound} - If any required object (fee type, fee status, loan) is not found.
 * @throws {ObjectAlreadyExists} - If the fee already exists.
 */
export const create_fee = async (req, res) => {
    const {fee_type, fee_status, loan, paid_date, due_payment_date} = req.body;
    try {
        await fee_service.create_new_fee(fee_type, fee_status, loan, paid_date, due_payment_date);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_FEE, `LOAN ${loan}`);
        res.status(201).json({message: 'Fee registered successfully'});
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        apiLogger.error('Error creating fee: ' + error.message);
        res.status(500).json({message: 'Error creating fee', error: error.message});
    }
}
/**
 * Retrieves all fees or filters them based on the provided query parameters.
 * 
 * @param {Object} req - The request object, containing filter parameters in the query.
 * @param {Object} res - The response object to send the result.
 * @returns {void}
 * @throws {ObjectInvalidQueryFilters} - If the query parameters are invalid.
 */
export const get_all_fees = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT, sort = "asc", sort_by = "createdAt" } = req.query;
        if(!filter_field || !filter_value) {
            const fees = await fee_service.get_all_fees(page, limit, sort, sort_by);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_FEE, 'ALL_FEES');
            res.json(fees);
        } else {
            const fees = await fee_service.filter_fees(filter_field, filter_value, page, limit, sort, sort_by);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_FEE, 'FILTERED_FEES');
            res.json(fees);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching fees: ' + error.message);
        res.status(500).json({message: 'Error fetching fees', error: error.message});
    }
}
/**
 * Retrieves a fee by its ID and sends the result in the response.
 * 
 * @param {Object} req - The request object, containing the fee ID in the params.
 * @param {Object} res - The response object to send the result.
 * @returns {void}
 * @throws {ObjectNotFound} - If the fee with the provided ID is not found.
 * @throws {ObjectMissingParameters} - If the ID is missing in the request parameters.
 */
export const get_fee_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        
        const fee = await fee_service.get_fee_by_id(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_FEE, id);
        res.json(fee);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching fee by ID: ' + error.message);
        res.status(500).json({message: 'Error fetching fee by ID', error: error.message});
    }
}
/**
 * Updates a fee based on the provided ID and updates in the request body.
 * 
 * @param {Object} req - The request object, containing the fee ID in the params and updates in the body.
 * @param {Object} res - The response object to send the result.
 * @returns {void}
 * @throws {ObjectMissingParameters} - If the fee ID is missing in the request parameters.
 * @throws {ObjectNotFound} - If the fee or any related object (fee type, fee status, loan) is not found.
 * @throws {ObjectAlreadyExists} - If the updated fee already exists.
 */
export const update_fee = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await fee_service.update_fee(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_FEE, id);
        res.json({message: 'Fee updated successfully'});
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
        apiLogger.error('Error updating fee: ' + error.message);
        res.status(500).json({message: 'Error updating fee', error: error.message});
    }
}
/**
 * Deletes a fee based on the provided ID and sends the result in the response.
 * 
 * @param {Object} req - The request object, containing the fee ID in the params.
 * @param {Object} res - The response object to send the result.
 * @returns {void}
 * @throws {ObjectMissingParameters} - If the fee ID is missing in the request parameters.
 * @throws {ObjectNotFound} - If the fee with the provided ID is not found.
 */
export const delete_fee = async (req, res) => {
    try {
        const id = req.params.id;
        await fee_service.delete_fee(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_FEE, id);
        res.json({message: 'Fee deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error deleting fee: ' + error.message);
        res.status(500).json({message: 'Error deleting fee', error: error.message});
    }
}