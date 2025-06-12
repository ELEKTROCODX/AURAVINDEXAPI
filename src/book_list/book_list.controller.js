import { app_config } from '../config/app.config.js';
import { ObjectNotFound, ObjectAlreadyExists, ObjectMissingParameters, ObjectInvalidQueryFilters, BookAlreadyInBookList, ExceededMaxBooksPerList, ExceededMaxBookLists } from '../config/errors.js';
import * as book_list_service from './book_list.service.js';
import * as audit_log_service from '../audit_log/audit_log.service.js';
import { apiLogger } from '../config/util.js';
/**
 * Controller function to create a new book list.
 * 
 * @param {Object} req - The request object containing the book list data in the body.
 * @param {Object} res - The response object to send the result.
 * @returns {void} The result of the book list creation.
 */
export const create_book_list = async (req, res) => {
    const {title, description, owner, books} = req.body;
    try {
        await book_list_service.create_new_book_list(title, description, owner, books);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.CREATE_BOOK_LIST, title);
        res.status(201).json({message: 'Book list registered successfully'});
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectAlreadyExists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ExceededMaxBookLists) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ExceededMaxBooksPerList) {
            return res.status(409).json({message: error.message});
        }
        apiLogger.error('Error creating book list: ', error.message);
        res.status(500).json({message: 'Error creating book list', error: error.message});
    }
}
/**
 * Controller function to retrieve all book lists.
 * 
 * @param {Object} req - The request object containing pagination and filter query parameters.
 * @param {Object} res - The response object to send the result.
 * @returns {void} The result of fetching all book lists or filtered book lists.
 */
export const get_all_book_lists = async (req, res) => {
    try {
        const { filter_field, filter_value, page = 1, limit = app_config.DEFAULT_PAGINATION_LIMIT } = req.query;
        if(!filter_field || !filter_value) {
            const book_lists = await book_list_service.get_all_book_lists(page, limit);
                await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_BOOK_LIST, 'ALL_BOOK_LISTS');
            res.json(book_lists);
        } else {
            const book_lists = await book_list_service.filter_book_lists(filter_field, filter_value, page, limit);
                await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_BOOK_LIST, 'FILTERED_BOOK_LISTS');
            res.json(book_lists);
        }
    } catch (error) {
        if(error instanceof ObjectInvalidQueryFilters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching book lists: ', error.message);
        res.status(500).json({message: 'Error fetching book lists', error: error.message});
    }
}
/**
 * Controller function to retrieve a book list by ID.
 * 
 * @param {Object} req - The request object containing the book list ID in the params.
 * @param {Object} res - The response object to send the result.
 * @returns {void} The result of fetching a book list by ID.
 */
export const get_book_list_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        
        const book_list = await book_list_service.get_book_list_by_id(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.READ_BOOK_LIST, id);
        res.json(book_list);
    } catch (error) {
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        apiLogger.error('Error fetching book list by ID: ', error.message);
        res.status(500).json({message: 'Error fetching book list by ID', error: error.message});
    }
}
/**
 * Controller function to update a book list by ID.
 * 
 * @param {Object} req - The request object containing the book list ID in the params and the updates in the body.
 * @param {Object} res - The response object to send the result.
 * @returns {void} The result of the book list update.
 */
export const update_book_list = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        await book_list_service.update_book_list(id, updates);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.UPDATE_BOOK_LIST, id);
        res.json({message: 'Book list updated successfully'});
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
        apiLogger.error('Error updating book list: ', error.message);
        res.status(500).json({message: 'Error updating book list', error: error.message});
    }
}
/**
 * Controller function to add a book to a book list.
 * 
 * @param {Object} req - The request object containing the book list ID and book ID in the params.
 * @param {Object} res - The response object to send the result.
 * @returns {void} The result of adding the book to the list.
 */
export const add_book_to_book_list = async (req, res) => {
    try {
        const {book_list_id, book_id} = req.params;
        await book_list_service.add_book_to_book_list(book_list_id, book_id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.ADD_BOOK_TO_LIST, `${book_list_id} - ${book_id}`);
        res.json({message: "Book added successfully"});
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
        if(error instanceof BookAlreadyInBookList) {
            return res.status(409).json({message: error.message});
        }
        if(error instanceof ExceededMaxBooksPerList) {
            return res.status(409).json({message: error.message});
        }
        apiLogger.error('Error adding book to book list: ', error.message);
        res.status(500).json({message: 'Error adding book to book list', error: error.message});
    }
}
/**
 * Controller function to remove a book from a book list.
 * 
 * @param {Object} req - The request object containing the book list ID and book ID in the params.
 * @param {Object} res - The response object to send the result.
 * @returns {void} The result of removing the book from the list.
 */
export const remove_book_from_book_list = async (req, res) => {
    try {
        const {book_list_id, book_id} = req.params;
        await book_list_service.remove_book_from_book_list(book_list_id, book_id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.REMOVE_BOOK_FROM_LIST, `${book_list_id} - ${book_id}`);   
        res.json({message: "Book removed successfully"});
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
        apiLogger.error('Error removing book from book list: ', error.message);
        res.status(500).json({message: 'Error removing book from book list', error: error.message});
    }
}
/**
 * Controller function to delete a book list by ID.
 * 
 * @param {Object} req - The request object containing the book list ID in the params.
 * @param {Object} res - The response object to send the result.
 * @returns {void} The result of deleting the book list.
 */
export const delete_book_list = async (req, res) => {
    try {
        const id = req.params.id;
        await book_list_service.delete_book_list(id);
        await audit_log_service.create_new_audit_log(req.user.id, app_config.PERMISSIONS.DELETE_BOOK_LIST, id);     
        res.json({message: 'Book list deleted successfully'});
    } catch (error) {
        if(error instanceof ObjectMissingParameters) {
            return res.status(400).json({message: error.message});
        }
        if(error instanceof ObjectNotFound) {
            return res.status(404).json({message: error.message});
        }
        apiLogger.error('Error deleting book list: ', error.message);
        res.status(500).json({message: 'Error deleting book list', error: error.message});
    }
}