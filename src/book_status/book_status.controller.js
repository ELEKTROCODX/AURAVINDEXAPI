import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as book_status_service from './book_status.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
import { apiLogger } from '../config/util.js';
/**
 * Creates a new book status by calling the book status service.
 * 
 * @param {Object} req The request object containing the book status in the body.
 * @param {Object} res The response object for sending back the result.
 * @returns {void}
 */
export const create_book_status = async (req, res) => {
    const {book_status} = req.body;
    try {
        await book_status_service.create_new_book_status(book_status);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_BOOK_STATUS, book_status);
        res.status(201).json({message: 'Book status registered successfully'});
    } catch (error) {
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error creating book status: ' + error.message);
        res.status(500).json({message: 'Error creating book status', error: error.message});
    }
}

/**
 * Retrieves all book statuses, optionally filtered by query parameters.
 * 
 * @param {Object} req The request object containing query parameters for filtering and pagination.
 * @param {Object} res The response object for sending back the list of book statuses.
 * @returns {void}
 */
export const get_all_book_statuses = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const book_statuses = await book_status_service.get_all_book_statuses(page, limit);
            res.json(book_statuses);
        } else {
            const book_statuses = await book_status_service.filter_book_statuses(filter_field, filter_value, page, limit);
            res.json(book_statuses);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching book statuses: ' + error.message);
        res.status(500).json({message: 'Error fetching book statuses', error: error.message});
    }
}
/**
 * Retrieves a book status by its ID.
 * 
 * @param {Object} req The request object containing the book status ID as a URL parameter.
 * @param {Object} res The response object for sending back the result.
 * @returns {void}
 */
export const get_book_status_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        
        const book_status = await book_status_service.get_book_status_by_id(id);
        res.json(book_status);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching book status by ID: ' + error.message);
        res.status(500).json({message: 'Error fetching book status by ID', error: error.message});
    }
}
/**
 * Updates a book status by its ID.
 * 
 * @param {Object} req The request object containing the book status ID as a URL parameter and updates in the body.
 * @param {Object} res The response object for sending back the result.
 * @returns {void}
 */
export const update_book_status = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await book_status_service.update_book_status(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_BOOK_STATUS, id);
        res.json({message: 'Book status updated successfully'});
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
        apiLogger.error('Error updating book status: ' + error.message);
        res.status(500).json({message: 'Error updating book status', error: error.message});
    }
}
/**
 * Deletes a book status by its ID.
 * 
 * @param {Object} req The request object containing the book status ID as a URL parameter.
 * @param {Object} res The response object for sending back the result.
 * @returns {void}
 */
export const delete_book_status = async (req, res) => {
    try {
        const id = req.params.id;
        await book_status_service.delete_book_status(id);        
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_BOOK_STATUS, id);
        res.json({message: 'Book status deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error deleting book status: ' + error.message);
        res.status(500).json({message: 'Error deleting book status', error: error.message});
    }
}