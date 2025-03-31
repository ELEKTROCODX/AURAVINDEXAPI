import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as fee_status_service from './fee_status.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
/**
 * Controller function to create a fee status.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
export const create_fee_status = async (req, res) => {
    const {fee_status} = req.body;
    try {
        await fee_status_service.create_new_fee_status(fee_status);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_FEE_STATUS, fee_status);
        res.status(201).json({message: 'Fee status registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        res.status(500).json({message: 'Error creating fee status', error: error.message});
    }
}
/**
 * Controller function to get all fee statuses with optional filtering.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
export const get_all_fee_statuses = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const fee_statuses = await fee_status_service.get_all_fee_statuses(page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_FEE_STATUS, 'ALL_FEE_STATUSES');
            res.json(fee_statuses);
        } else {
            const fee_statuses = await fee_status_service.filter_fee_statuses(filter_field, filter_value, page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_FEE_STATUS, 'FILTERED_FEE_STATUSES');
            res.json(fee_statuses);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching fee statuses', error: error.message});
    }
}
/**
 * Controller function to get a fee status by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
export const get_fee_status_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        
        const fee_status = await fee_status_service.get_fee_status_by_id(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_FEE_STATUS, id);
        res.json(fee_status);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching fee status by ID', error: error.message});
    }
}
/**
 * Controller function to update a fee status by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
export const update_fee_status = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await fee_status_service.update_fee_status(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_FEE_STATUS, id);
        res.json({message: 'Fee status updated successfully'});
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
        res.status(500).json({message: 'Error updating fee status', error: error.message});
    }
}
/**
 * Controller function to delete a fee status by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
export const delete_fee_status = async (req, res) => {
    try {
        const id = req.params.id;
        await fee_status_service.delete_fee_status(id);        
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_FEE_STATUS, id);
        res.json({message: 'Fee status deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error deleting fee status', error: error.message});
    }
}