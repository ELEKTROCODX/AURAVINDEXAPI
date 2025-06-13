import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters } from '../config/errors.js';
import * as recent_book_service from './recent_book.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
import { apiLogger } from '../config/util.js';
/**
 * Creates a new recent book entry by calling the service.
 * 
 * @param {Request} req - The request object containing user, action, and object data.
 * @param {Response} res - The response object to send the status.
 * @returns {void}
 */
export const create_recent_book = async (req, res) => {
    const {user, books} = req.body;
    try {
        await recent_book_service.create_new_recent_book(user, books);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_RECENT_BOOK, `${user}`);
        res.status(201).json({message: 'Audit log registered successfully'});
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        apiLogger.error('Error creating recent book: ' + error.message);
        res.status(500).json({message: 'Error creating recent book', error: error.message});
    }
}
/**
 * Retrieves all recent books, optionally filtered by the query parameters.
 * 
 * @param {Request} req - The request object containing query parameters.
 * @param {Response} res - The response object to send the results.
 * @returns {void}
 */
export const get_all_recent_books = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const recent_books = await recent_book_service.get_all_recent_books(page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_RECENT_BOOK, 'RECENT_BOOKS');
            res.json(recent_books);
        } else {
            const recent_books = await recent_book_service.filter_recent_books(filter_field, filter_value, page, limit);
            await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_RECENT_BOOK, 'FILTERED_RECENT_BOOKS');
            res.json(recent_books);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching recent books: ' + error.message);
        res.status(500).json({message: 'Error fetching recent book', error: error.message});
    }
}
/**
 * Retrieves a specific recent book by its ID.
 * 
 * @param {Request} req - The request object containing the ID parameter.
 * @param {Response} res - The response object to send the requested recent book.
 * @returns {void}
 */
export const get_recent_book_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const recent_book = await recent_book_service.get_recent_book_by_id(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_RECENT_BOOK, id);
        res.json(recent_book);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching recent book by ID: ' + error.message);
        res.status(500).json({message: 'Error fetching recent book by ID', error: error.message});
    }
}
