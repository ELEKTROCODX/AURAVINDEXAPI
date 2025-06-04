import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as fee_type_service from './fee_type.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
/**
 * Controller to create a new fee type.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} - The response will indicate whether the creation was successful or if an error occurred.
 */
export const create_fee_type = async (req, res) => {
    const {fee_code, message, cost} = req.body;
    try {
        await fee_type_service.create_new_fee_type(fee_code, message, cost);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_ALERT, fee_code);
        res.status(201).json({message: 'Fee type registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        res.status(500).json({message: 'Error creating fee type', error: error.message});
    }
}
/**
 * Controller to retrieve all fee types, with optional filtering.
 * 
 * @param {Object} req - The request object, may contain query parameters for filtering.
 * @param {Object} res - The response object.
 * @returns {void} - The response will contain the fee types or an error message.
 */
export const get_all_fee_types = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const fee_types = await fee_type_service.get_all_fee_types(page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_FEE_TYPE, 'ALL_FEE_TYPES');
            res.json(fee_types);
        } else {
            const fee_types = await fee_type_service.filter_fee_types(filter_field, filter_value, page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_FEE_TYPE, 'FILTERED_FEE_TYPES');
            res.json(fee_types);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching fee types', error: error.message});
    }
}
/**
 * Controller to retrieve a fee type by its ID.
 * 
 * @param {Object} req - The request object, containing the fee type ID as a parameter.
 * @param {Object} res - The response object.
 * @returns {void} - The response will contain the fee type or an error message.
 */
export const get_fee_type_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const fee_type = await fee_type_service.get_fee_type_by_id(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_FEE_TYPE, id);
        res.json(fee_type);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: 'Error fetching fee type by ID', error: error.message});
    }
}
/**
 * Controller to update an existing fee type.
 * 
 * @param {Object} req - The request object, containing the fee type ID as a parameter and the updates in the body.
 * @param {Object} res - The response object.
 * @returns {void} - The response will indicate whether the update was successful or if an error occurred.
 */
export const update_fee_type = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await fee_type_service.update_fee_type(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_FEE_TYPE, id);
        res.json({message: 'Fee type updated successfully'});
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
        res.status(500).json({message: 'Error updating fee type', error: error.message});
    }
}
/**
 * Controller to delete a fee type by its ID.
 * 
 * @param {Object} req - The request object, containing the fee type ID as a parameter.
 * @param {Object} res - The response object.
 * @returns {void} - The response will indicate whether the deletion was successful or if an error occurred.
 */
export const delete_fee_type = async (req, res) => {
    try {
        const id = req.params.id;
        await fee_type_service.delete_fee_type(id);        
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_FEE_TYPE, id);
        res.json({message: 'Fee type deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        // Internal error
        res.status(500).json({message: 'Error deleting fee type', error: error.message});
    }
}