import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as editorial_service from './editorial.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
import { apiLogger } from '../config/util.js';
/**
 * Creates a new editorial and returns the result.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing editorial details.
 * @param {string} req.body.name - The name of the editorial.
 * @param {string} req.body.address - The address of the editorial.
 * @param {string} req.body.email - The email of the editorial.
 * @param {Object} res - The HTTP response object.
 * @throws {ObjectAlreadyExists} If the editorial already exists.
 * @returns {void} Sends a JSON response indicating the creation result.
 */
export const create_editorial = async (req, res) => {
    const {name, address, email} = req.body;
    try {
        await editorial_service.create_new_editorial(name, address, email);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_EDITORIAL, name);
        res.status(201).json({message: 'Editorial registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error creating editorial: ', error.message);
        res.status(500).json({message: 'Error creating editorial', error: error.message});
    }
}
/**
 * Retrieves a list of editorials with optional filtering.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.query - The query parameters.
 * @param {string} [req.query.filter_field] - The field to filter by (optional).
 * @param {string} [req.query.filter_value] - The value to filter by (optional).
 * @param {number} [req.query.page=1] - The page number for pagination.
 * @param {number} [req.query.limit=app_config.DEFAULT_PAGINATION_LIMIT] - The number of items per page.
 * @param {Object} res - The HTTP response object.
 * @throws {ObjectInvalidQueryFilters} If the query parameters are invalid.
 * @returns {void} Sends a JSON response with the list of editorials.
 */
export const get_all_editorials = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const editorials = await editorial_service.get_all_editorials(page, limit);
            res.json(editorials);
        } else {
            const editorials = await editorial_service.filter_editorials(filter_field, filter_value, page, limit);
            res.json(editorials);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching editorials: ', error.message);
        res.status(500).json({message: 'Error fetching editorials', error: error.message});
    }
}
/**
 * Retrieves an editorial by its ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the editorial.
 * @param {Object} res - The HTTP response object.
 * @throws {ObjectNotFound} If no editorial with the given ID is found.
 * @throws {ObjectMissingParameters} If the ID is missing.
 * @returns {void} Sends a JSON response with the editorial details.
 */
export const get_editorial_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const editorial = await editorial_service.get_editorial_by_id(id);
        res.json(editorial);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching editorial by ID: ', error.message);
        res.status(500).json({message: 'Error fetching editorial by ID', error: error.message});
    }
}
/**
 * Updates an editorial's details.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the editorial to update.
 * @param {Object} req.body - The updates to apply to the editorial.
 * @param {Object} res - The HTTP response object.
 * @throws {ObjectMissingParameters} If the ID or update details are missing.
 * @throws {ObjectNotFound} If no editorial with the given ID is found.
 * @throws {ObjectAlreadyExists} If another editorial with the same name or email already exists.
 * @returns {void} Sends a JSON response indicating the update result.
 */
export const update_editorial = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await editorial_service.update_editorial(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_EDITORIAL, id);
        res.json({message: 'Editorial updated successfully'});
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
        apiLogger.error('Error updating editorial: ', error.message);
        res.status(500).json({message: 'Error updating editorial', error: error.message});
    }
}
/**
 * Deletes an editorial by its ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.params.id - The ID of the editorial to delete.
 * @param {Object} res - The HTTP response object.
 * @throws {ObjectMissingParameters} If the ID is missing.
 * @throws {ObjectNotFound} If no editorial with the given ID is found.
 * @returns {void} Sends a JSON response indicating the delete result.
 */
export const delete_editorial = async (req, res) => {
    try {
        const id = req.params.id;
        await editorial_service.delete_editorial(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_EDITORIAL, id);
        res.json({message: 'Editorial deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error deleting editorial: ', error.message);
        res.status(500).json({message: 'Error deleting editorial', error: error.message});
    }
}